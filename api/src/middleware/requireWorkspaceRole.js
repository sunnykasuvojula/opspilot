import WorkspaceMember from "../models/WorkspaceMember.js";

/**
 * Workspace RBAC middleware.
 *
 * Usage:
 *   router.post("/workspaces/:workspaceId/projects", auth, requireWorkspaceRole("ADMIN"), createProject)
 *
 * Assumes your auth middleware sets:
 *   req.user = { id: "<userId>" }   OR   req.user = { userId: "<userId>" }
 * (This middleware supports both.)
 */
const ROLE_RANK={
    VIEWER: 1,
    MEMBER: 2,
    ADMIN: 3,
    OWNER: 4,
}
export default function requireWorkspaceRole(minRole="VIEWER")
{
    if(!ROLE_RANK[minRole])
    {
        throw new error(`Invalis workspace role "${minRole}"`);
    }
    return async function (req, res, next) {
        try
        {
        const workspaceId=req.params.workspaceId;
        const userId=req.user?.userId || req.user?.id;

        if(!workspaceId)
        {
            return res.status(400).json({message:"Workspace is required in the route params."});
        }
        if(!userId)
        {
            return res(401).json({message:"Unauthroized"});
        }

        //FIND MEMBERSHIP FOR ROLE IN THIS WORKSPACE
        const membership=await WorkspaceMember.findOne({
            workspaceId,
            userId,
            status:"ACTIVE"
        }).select("role status");
        if(!membership)
        {
            return res.status(403).json({ message: "Forbidden: not a member of this workspace" });
        }
        const userRank=ROLE_RANK[membership.role] || 0;
        const requiredRank=ROLE_RANK[minRole];

        if(userRank < requiredRank)
        {
            return res.status(403).json({message:`Forbidden requires ${minRole} access.`});
        }
    // Attach membership for controllers to reuse (optional but helpful)
    req.WorkspaceMember={
        role:membership.role,
    };
    return next();

    }
    catch(err)
    {
        return next(err);
    }
}
};