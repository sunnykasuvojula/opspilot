import {Router} from 'express';
import { register,login } from '../controllers/auth.controller.js';
import { getMyWorkspaces } from '../controllers/workspace.controller.js';
import requireWorkspaceRole from '../middleware/requireWorkspaceRole.js';
import {listProjects,createProject,deleteProject,updateProject} from '../controllers/project.controller.js';
import {createIssue, deleteIssue, listIssues, updateIssue} from '../controllers/issue.controller.js';
import auth from '../middleware/auth.js';

const router=Router();

router.post("/register",register)
router.post("/login",login)
router.get("/workspaces/me",auth,getMyWorkspaces)

// Anyone in workspace can view projects
router.get("/workspaces/:workspaceId/projects",auth, requireWorkspaceRole("VIEWER"), listProjects)

// Only ADMIN/OWNER can create projects
router.post("/workspaces/:workspaceId/projects",auth, requireWorkspaceRole("ADMIN"), createProject)

//route to delete project [* DELETE /workspaces/:workspaceId/projects/:projectId (OWNER)]
router.delete("/workspaces/:workspaceId/projects/:projectId",auth,requireWorkspaceRole("OWNER"),deleteProject)

//route to update project[ADMIN/OWNER]
router.patch("/workspaces/:workspaceId/projects/:projectId",auth,requireWorkspaceRole("ADMIN"),updateProject)

router.post("/workspaces/:workspaceId/projects/:projectId/issues",auth,requireWorkspaceRole("MEMBER"),createIssue);

router.get("/workspaces/:workspaceId/projects/:projectId/issues",auth,requireWorkspaceRole("VIEWER"),listIssues);

router.delete("/workspaces/:workspaceId/projects/:projectId/issues/:issueId",auth,requireWorkspaceRole("ADMIN"),deleteIssue);

router.patch("/workspaces/:workspaceId/projects/:projectId/issues/:issueId",auth,requireWorkspaceRole("MEMBER"),updateIssue);
//protected route example
router.get("/me",auth,(req,res)=>{
    //req.user came with jwt verify
    res.json({user:req.user});
});
export default router;