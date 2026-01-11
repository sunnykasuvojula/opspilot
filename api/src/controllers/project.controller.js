import mongoose from "mongoose";
import Project from "../models/Project.js";

export async function listProjects(req, res, next) {
  try {
    const { workspaceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({ message: "Invalid workspaceId" });
    }

    const projects = await Project.find({
      workspaceId: new mongoose.Types.ObjectId(workspaceId),
    })
      .sort({ createdAt: -1 })
      .select("name key description createdAt updatedAt");

    return res.json({ projects });
  } catch (err) {
    next(err);
  }
}


export async function createProject(req, res, next) {
  try {
    const { workspaceId } = req.params;
    const userId = req.user?.userId || req.user?.id;

    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const key = typeof req.body?.key === "string" ? req.body.key.toUpperCase().trim() : "";
    const description =
      typeof req.body?.description === "string" ? req.body.description.trim() : undefined;

    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId missing in params" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!name || !key) {
      return res.status(400).json({ message: "name and key are required" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(workspaceId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid workspaceId or userId" });
    }

    const project = await Project.create({
      workspaceId: new mongoose.Types.ObjectId(workspaceId),
      name,
      key,
      description,
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    return res.status(201).json({
      project: {
        id: project._id,
        workspaceId: project.workspaceId,
        name: project.name,
        key: project.key,
        description: project.description,
        createdAt: project.createdAt,
      },
    });
  } catch (err) {
    // Handle duplicate key error (workspaceId + key)
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Project key already exists in this workspace",
      });
    }
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  const {workspaceId,projectId}=req.params;

  //Make sure project belong to the workspace

  const project=await Project.findOne({
    _id: projectId,
    workspaceId: workspaceId
  })

  if(!project)
  {
    return res.status(400).json({message:"Project not found in workspace"});
  }

  await Project.findOneAndDelete({_id:projectId,workspaceId});
  res.json({success: true })
}

export async function updateProject(req,res,next){

  const {workspaceId,projectId}=req.params;
  const {name,key,description}=req.body;

  const project=await Project.findOne({
    _id:projectId,
    workspaceId:workspaceId
  })
  try{

  if(!project)
  {
    return res.status(400).json({message:"Project not found in the workspace"});
  }

  const updatedProject=await Project.findOneAndUpdate(
    {_id:projectId,workspaceId},
    {
      $set:{
        name:name,
        key:key,
        description:description,
      },
    },
    {new:true}
  );
   res.json({project:updatedProject});

  }
  catch(err)
  {
    if(err.code==11000)
    {
      return res.status(409).json({message:"Project key already exists in this workspace"})
    }
    throw err;
  }
}