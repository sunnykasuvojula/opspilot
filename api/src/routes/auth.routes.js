import {Router} from 'express';
import { register,login } from '../controllers/auth.controller.js';
import { getMyWorkspaces } from '../controllers/workspace.controller.js';
import auth from '../middleware/auth.js';

const router=Router();

router.post("/register",register)
router.post("/login",login)
router.get("/workspaces/me",auth,getMyWorkspaces)
//protected route example
router.get("/me",auth,(req,res)=>{
    //req.user came with jwt verify
    res.json({user:req.user});
});

export default router;