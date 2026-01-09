import Project from "../models/Project.js"
export async function listProjects(req, res)
{
    const {workspaceId}=req.params;

    const projects=await Project.find({workspaceId}).sort({createdAt:-1})
    .select("name key description createdAt updatedAt");

    return res.json({projects});
}

export async function createProject() {
    const {workspaceId}=req.params;
    const {name, key, description}=req.body;
    if (!name || !key) {
        return res.status(400).json({ message: "name and key are required" });
      }
      const normalizedKey = key.toUpperCase().trim();

    const project=await Project.create(
        {
            name:name.trim(),
            key:normalizedKey,
            description:description.trim(),
            createdBy:req.user.id || req.user.userId,
        });


        return res.status(201).json(
            {
                project:{
                    id:project._id,
                    workspaceId:project.workspaceId,
                    name:project.name,
                    key:project.key,
                    description:project.description,
                    createdAt:project.createdAt,
                },
            });
}