import mongoose from "mongoose";
import WorkspaceMember from "../models/WorkspaceMember.js";
export async function getMyWorkspaces(req,res) {
    const userId=req.user.userId;
    const memeberships=await WorkspaceMember.find({

        userId,
        status:"ACTIVE",
    })
    .populate("workspaceId", "name createdAt").select("role workspaceId");

    const workspaces=memeberships.map((m)=>({
        id: m.workspaceId._id,
        name: m.workspaceId.name,
        role: m.role,
        joinedAt: m.createdAt,
    }));
    return res.json({ workspaces });

}