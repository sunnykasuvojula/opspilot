//Controller  → fetches user from DB
import mongoose from 'mongoose';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import { signAccessToken } from '../utils/jwt.js';

export async function register(req,res) 
{
    const {name,email,password}=req.body;
    const normalizedEmail = email.toLowerCase().trim();
    //check exisitng
    const exisitng=await User.findOne({email:normalizedEmail});
    if(exisitng) return res.status(409).json({message:"Email already in use"});
    
  // 2) hash password (using your static helper)
    const passwordHash=await User.hashPassword(password);
// create session to start a transaction
const session=await mongoose.startSession();
session.startTransaction();

try{
     //create user

     const user=await User.create(
        [{name,email:normalizedEmail,passwordHash}],
        {session}
    ).then((arr)=>arr[0]);
    
    //create workspace for this user
    const workspaceName=`${name} Workspace`;
    const workspace=await Workspace.create(
        [{name:workspaceName, createdBy:user._id}],
        {session}
    ).then((arr)=>arr[0]);

    //make user as OWNER in that workspace
    const membership=await WorkspaceMember.create(
        [{workspaceId:workspace._id,userId:user._id,role:"OWNER",status:"ACTIVE",}],
        {session}
    ).then((arr)=>arr[0]);
    await session.commitTransaction();
    session.endSession();

    //create jwt
    const token=signAccessToken(user);

    //return token+safe user

    return res.status(201).json({
        token,
        user:{id:user._id,name:user.name,email:user.email},
        workspace:{id:workspace._id,name:workspace.name},
        membership:{role:membership.role, status:membership.status},
    });
}
catch(err)
{
    await session.abortTransaction();
    session.endSession();
    throw err; // let your global error handler format it
}

}

export async function login(req, res) {
    try {
      const { email, password } = req.body;
  
      // 1. Find user (include passwordHash) ✅ Perfect
      const user = await User.findOne({ 
        email: email.toLowerCase().trim() 
      }).select("+passwordHash");
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // 2. Compare password ✅ Perfect
      const ok = await user.comparePassword(password);
      if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // 3. Create JWT ✅ Perfect
      const token = signAccessToken(user);
  
      // 4. FIX: Get workspace & membership (same as register)
      const workspace = await Workspace.findOne({ createdBy: user._id });
      const membership = await WorkspaceMember.findOne({ 
        workspaceId: workspace._id, 
        userId: user._id 
      });
  
      // 5. SAME response as register ✅
      res.json({
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email 
        },
        workspace: { 
          id: workspace._id, 
          name: workspace.name 
        },
        membership: { 
          role: membership.role, 
          status: membership.status 
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  