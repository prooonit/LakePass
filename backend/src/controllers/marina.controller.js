import { asyncHandler } from "../utils/async-handler.js";
import {
  createMarina,
  getMarinaMembers,
  getMyMarinas,
  inviteMember,
} from "../services/marina.service.js";

export const createMarinaController = asyncHandler(async (req, res) => {
  const marina = await createMarina(req.user.id, req.body || {});

  return res.status(201).json({
    success: true,
    data: marina,
  });
});

export const getMyMarinasController = asyncHandler(async (req, res) => {
  const marinas = await getMyMarinas(req.user.id);

  return res.status(200).json({
    success: true,
    data: marinas,
  });
});

export const inviteMemberController = asyncHandler(async (req, res) => {
  const invitation = await inviteMember(req.user.id, req.params.marinaId, req.body || {});

  return res.status(201).json({
    success: true,
    data: invitation,
  });
});


export const getMarinaMembersController = asyncHandler(async (req, res) => {
  const members = await getMarinaMembers(req.params.marinaId);

  return res.status(200).json({
    success: true,
    data: members,
  });
});
