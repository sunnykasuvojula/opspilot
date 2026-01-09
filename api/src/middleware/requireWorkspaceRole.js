import mongoose from "mongoose";
import WorkspaceMember from "../models/WorkspaceMember.js";

const ROLE_RANK = {
  VIEWER: 1,
  MEMBER: 2,
  ADMIN: 3,
  OWNER: 4,
};

export default function requireWorkspaceRole(minRole = "VIEWER") {
  const normalizedRole = String(minRole).toUpperCase();

  if (!ROLE_RANK[normalizedRole]) {
    throw new Error(`Invalid workspace role "${minRole}"`);
  }

  return async function (req, res, next) {
    try {
      const { workspaceId } = req.params;
      const userId = req.user?.userId || req.user?.id;

      if (!workspaceId) {
        return res
          .status(400)
          .json({ message: "Workspace is required in the route params." });
      }

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validate ObjectIds
      if (
        !mongoose.Types.ObjectId.isValid(workspaceId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        return res.status(400).json({ message: "Invalid workspace or user id." });
      }

      const membership = await WorkspaceMember.findOne({
        workspaceId: new mongoose.Types.ObjectId(workspaceId),
        userId: new mongoose.Types.ObjectId(userId),
        status: "ACTIVE",
      }).select("role");

      if (!membership) {
        return res
          .status(403)
          .json({ message: "Forbidden: not a member of this workspace" });
      }

      const userRank = ROLE_RANK[membership.role];
      const requiredRank = ROLE_RANK[normalizedRole];

      if (userRank < requiredRank) {
        return res
          .status(403)
          .json({ message: `Forbidden: requires ${normalizedRole} access.` });
      }

      // Optional but very useful for controllers
      req.workspaceMember = {
        role: membership.role,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
}
