import mongoose from "mongoose";

const issueSchema=new mongoose.Schema({
workspaceId:{type:mongoose.Schema.Types.ObjectId,ref:"Workspace",required:true},
projectId:{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:true},
title:{type:String, required:true,trim:true},
description:{type:String, required:true},
type:{type:String,enum:["BUG","TASK","STORY"], default:"TASK",required:true},
status:{type:String,enum:["TODO","IN_PROGRESS","DONE"], default:"TODO", index:true},
priority:{type:String,enum:["LOW","MEDIUM","HIGH","URGENT"], default:"MED", index:true},
assigneeId:{type:mongoose.Schema.Types.ObjectId, ref:"User", default:null, index:true},
createdBy:{type:mongoose.Schema.Types.ObjectId, ref:"User",required:true},
issueNumber:{type:Number,required:true},
issueKey:{type:String,required:true},
},
{timestamps:true})
// Prevent duplicates per project
issueSchema.index({ projectId: 1, issueNumber: 1 }, { unique: true });
// Optional helpful index for lists:
issueSchema.index({ workspaceId: 1, projectId: 1, createdAt: -1 });

export default mongoose.model("Issue",issueSchema);