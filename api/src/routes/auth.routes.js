import {Router} from 'express';
import { register,login } from '../controllers/auth.controller.js';
import { getMyWorkspaces } from '../controllers/workspace.controller.js';
import requireWorkspaceRole from '../middleware/requireWorkspaceRole.js';
import {listProjects,createProject} from '../controllers/project.controller.js';
import auth from '../middleware/auth.js';

const router=Router();

router.post("/register",register)
router.post("/login",login)
router.get("/workspaces/me",auth,getMyWorkspaces)


// Anyone in workspace can view projects
router.get("/workspaces/:workspaceId/projects",auth, requireWorkspaceRole("VIEWER"), listProjects)

// Only ADMIN/OWNER can create projects
router.post("/workspaces/:workspaceId/projects",auth, requireWorkspaceRole("ADMIN"), createProject)

//protected route example
router.get("/me",auth,(req,res)=>{
    //req.user came with jwt verify
    res.json({user:req.user});
});
export default router;