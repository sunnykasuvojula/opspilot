import mongoose from "mongoose";
import Project from "../models/Project.js";
import Issue from "../models/Issue.js";

export async function listIssues(req, res, next) {
    try{
        const{workspaceId,projectId}=req.params;
        if (!mongoose.Types.ObjectId.isValid(workspaceId) || !mongoose.Types.ObjectId.isValid(projectId)) {
              return res.status(400).json({ message: "Invalid workspaceId" });
        }
    
        const issues=await Issue.find(
            {
                workspaceId:new mongoose.Types.ObjectId(workspaceId),
                projectId:new mongoose.Types.ObjectId(projectId),
            }).sort({createdAt:-1})
            .populate("assigneeId", "name")
            .select("issueKey description issueNumber title type status priority assigneeId createdBy createdAt updatedAt");
    
            return res.json({issues});
    }
    catch(err)
    {
        next(err);
    }
}

export async function createIssue(req, res, next) {
  const session = await mongoose.startSession();

  try {
    const { workspaceId, projectId } = req.params;
    const userId = req.user?.userId ?? req.user?.id;

    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    const description =
      typeof req.body?.description === "string" ? req.body.description.trim() : "";

    const type = typeof req.body?.type === "string" ? req.body.type.toUpperCase().trim() : "TASK";
    const status =
      typeof req.body?.status === "string" ? req.body.status.toUpperCase().trim() : "TODO";

    // IMPORTANT: use req.body.priority (not proirity)
    const priority =
      typeof req.body?.priority === "string" ? req.body.priority.toUpperCase().trim() : "MED";

    const assigneeId = req.body?.assigneeId || null;

    if (
      !mongoose.Types.ObjectId.isValid(workspaceId) ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      return res.status(400).json({ message: "Invalid workspaceId or projectId" });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    let createdIssue;

    await session.withTransaction(async () => {
      const project = await Project.findOneAndUpdate(
        { _id: projectId, workspaceId },
        { $inc: { nextIssueNumber: 1 } },
        { new: false, session, projection: { key: 1, nextIssueNumber: 1 } } // old doc
      );

      if (!project) {
        const e = new Error("Project not found in workspace");
        e.statusCode = 404;
        throw e;
      }

      const issueNumber = project.nextIssueNumber || 1;
      const issueKey = `${project.key}-${issueNumber}`;

      const [issue] = await Issue.create(
        [
          {
            workspaceId,
            projectId,
            title,
            description,
            type,
            status,
            priority,
            assigneeId:
              assigneeId && mongoose.Types.ObjectId.isValid(assigneeId) ? assigneeId : null,
            createdBy: userId,
            issueNumber,
            issueKey,
          },
        ],
        { session }
      );

      createdIssue = issue;
    });

    return res.status(201).json({ issue: createdIssue });
  } catch (err) {
    if (err?.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Duplicate issue number" });
    }
    next(err);
  } finally {
    session.endSession();
  }
}

export async function deleteIssue(req, res, next) 
{
    const {workspaceId,projectId,issueId}=req.params;

    const issue=await Issue.findOne({
        workspaceId:workspaceId,
        projectId:projectId,
        _id:issueId
    })
    if(!issue)
    {
        return res.status(400).json({message:"Issue not found in the project"});
    }
    await Issue.findOneAndDelete({workspaceId,projectId,_id:issueId});
    res.json({success:true});
}

export async function updateIssue(req, res, next) {
  try {
    const { workspaceId, projectId, issueId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(workspaceId) ||
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(issueId)
    ) {
      return res.status(400).json({ message: "Invalid workspaceId, projectId, or issueId" });
    }

    // Normalize input
    const title =
      typeof req.body?.title === "string" ? req.body.title.trim() : undefined;

    const description =
      typeof req.body?.description === "string" ? req.body.description.trim() : undefined;

    const type =
      typeof req.body?.type === "string" ? req.body.type.toUpperCase().trim() : undefined;

    const status =
      typeof req.body?.status === "string" ? req.body.status.toUpperCase().trim() : undefined;

    const priority =
      typeof req.body?.priority === "string" ? req.body.priority.toUpperCase().trim() : undefined;

    const assigneeId = req.body?.assigneeId ?? undefined;

    const $set = {};
    if (title !== undefined) $set.title = title;
    if (description !== undefined) $set.description = description;
    if (type !== undefined) $set.type = type;
    if (status !== undefined) $set.status = status;
    if (priority !== undefined) $set.priority = priority;

    if (assigneeId !== undefined) {
      if (assigneeId === null) {
        $set.assigneeId = null;
      } else if (mongoose.Types.ObjectId.isValid(assigneeId)) {
        $set.assigneeId = assigneeId;
      } else {
        return res.status(400).json({ message: "Invalid assigneeId" });
      }
    }

    if (Object.keys($set).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updated = await Issue.findOneAndUpdate(
      { _id: issueId, workspaceId, projectId },
      { $set },
      { new: true, runValidators: true }
    ).select("issueKey issueNumber title description type status priority assigneeId createdBy createdAt updatedAt");

    if (!updated) {
      return res.status(404).json({ message: "Issue not found in this project/workspace" });
    }

    return res.json({ issue: updated });
  } catch (err) {
    next(err);
  }
}
