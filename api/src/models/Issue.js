import mongoose from "mongoose";

const issueSchema=new mongoose.Schema({
workspaceId:{type:mongoose.Schema.Types.ObjectId,ref:"Workspace",required:true},
projectId:{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:true},
title:{type:String, required:true},
type:{type:String,enum:["BUG","TASK","STORY"], default:"TASK",required:true},
})

export default mongoose.model("Issue",issueSchema);