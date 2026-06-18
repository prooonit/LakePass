import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { normalizeEmail, requireEnumValue, requireString } from "../utils/validation.js";

const INVITABLE_ROLES = ["MANAGER", "STAFF"];

const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const getUniqueSlug = async (name, tx) => {
  const baseSlug = createSlug(name) || "marina";
  let slug = baseSlug;
  let suffix = 1;

  while (await tx.marina.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
};

export const createMarina = async (userId, body) => {
  const name = requireString(body.name, "name");

  return prisma.$transaction(async (tx) => {
    const slug = body.slug ? createSlug(requireString(body.slug, "slug")) : await getUniqueSlug(name, tx);

    if (!slug) {
      throw new ApiError(400, "slug must contain letters or numbers");
    }

    const existingMarina = await tx.marina.findUnique({ where: { slug } });

    if (existingMarina) {
      throw new ApiError(409, "A marina with this slug already exists");
    }

    const marina = await tx.marina.create({
      data: {
        name,
        slug,
        ownerUserId: userId,
      },
    });

    const membership = await tx.marinaMember.create({
      data: {
        marinaId: marina.id,
        userId,
        role: "OWNER",
      },
    });

    return {
      ...marina,
      role: membership.role,
    };
  });
};

export const getMyMarinas = async (userId) => {
  const memberships = await prisma.marinaMember.findMany({
    where: { userId },
    include: { marina: true },
    orderBy: { createdAt: "asc" },
  });

  return memberships.map((membership) => ({
    ...membership.marina,
    role: membership.role,
    membershipId: membership.id,
  }));
};

export const inviteMember = async (invitedByUserId, marinaId, body) => {
  const email = normalizeEmail(body.email);
  const role = requireEnumValue(body.role || "STAFF", INVITABLE_ROLES, "role");

  return prisma.$transaction(async (tx) => {
    const invitedUser = await tx.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!invitedUser) {
      throw new ApiError(404, "User must sign up before they can be invited");
    }

    const existingMembership = await tx.marinaMember.findUnique({
      where: {
        marinaId_userId: {
          marinaId,
          userId: invitedUser.id,
        },
      },
    });

    if (existingMembership) {
      throw new ApiError(409, "User is already a member of this marina");
    }

    const membership = await tx.marinaMember.create({
      data: {
        marinaId,
        userId: invitedUser.id,
        role,
      },
    });

    const invitation = await tx.marinaInvitation.create({
      data: {
        marinaId,
        email: invitedUser.email,
        role,
        status: "ACCEPTED",
        invitedByUserId,
        acceptedByUserId: invitedUser.id,
        acceptedAt: new Date(),
      },
    });

    return {
      invitation,
      membership,
    };
  });
};

export const getMarinaMembers = async (marinaId) => {
  const members = await prisma.marinaMember.findMany({
    where: { marinaId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return members.map((member) => ({
    id: member.id,
    role: member.role,
    createdAt: member.createdAt,
    user: member.user,
  }));
};
