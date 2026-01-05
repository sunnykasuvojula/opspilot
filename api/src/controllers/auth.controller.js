//Controller  → fetches user from DB
import User from '../models/User.js';
import { signAccessToken } from '../utils/jwt.js';

export async function register(req,res) 
{
    const {name,email,password}=req.body;

    //check exisitng
    const exisitng=await User.findOne({email:email.toLowerCase().trim()});
    if(exisitng) return res.status(400).json({message:"Email already in use"});
    
  // 2) hash password (using your static helper)
    const passwordHash=await User.hashPassword(password);

    //create user

    const user=await User.create({
        name,
        email,
        passwordHash,
        role:"ADMIN",
    });


    //create jwt
    const token=signAccessToken(user);

    //return token+safe user

    res.status(201).json({
        token,
        user:{id:user._id,name:user.name,email:user.email,role:user.role},
    });
}


export async function login(req,res) 
{
    const {email,password}=req.body;
    //1.find user (include passwordHash)

    const user=await User.findOne({email:email.toLowerCase().trim()}).select("+passwordHash")
    
    if(!user) return res.status(401).json({message:"Invalid credentials"});

    //2.compare password
    const ok=await user.comparePassword(password);
    if(!ok) return res.status(401).json({message:"Invalid credentials"});

    //create JWT
    const token=signAccessToken(user);

    //return token + safe user

    res.json({
        token,
        user:{id:user._id, name:user.name, email:user.email, role:user.role},
    });
}