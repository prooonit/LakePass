import { OAuth2Client } from "google-auth-library";
import prisma from "../config/prisma.js";
import { generateToken } from "../utils/jwt.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sanitizeUser = (user) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

export const loginWithGoogle = async ({ idToken }) => {
  if (!idToken) {
    throw new Error("Google idToken is required");
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not configured");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email || !payload?.sub) {
    throw new Error("Invalid Google token");
  }

  if (!payload.email_verified) {
    throw new Error("Google email is not verified");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId: payload.sub },
        { email: payload.email },
      ],
    },
  });

  const user = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleId: existingUser.googleId ?? payload.sub,
          name: existingUser.name || payload.name || payload.email,
          avatarUrl: payload.picture,
          authProvider: existingUser.authProvider === "EMAIL" ? "EMAIL" : "GOOGLE",
        },
      })
    : await prisma.user.create({
        data: {
          name: payload.name || payload.email,
          email: payload.email,
          googleId: payload.sub,
          avatarUrl: payload.picture,
          authProvider: "GOOGLE",
        },
      });

  return {
    token: generateToken(user.id),
    user: sanitizeUser(user),
  };
};
