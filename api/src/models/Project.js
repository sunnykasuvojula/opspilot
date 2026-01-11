import mongoose from 'mongoose';

const projectScehma=new mongoose.Schema(
    {
        workspaceId:{type:mongoose.Schema.Types.ObjectId, ref:"Workspace",required:true, index:true},
        name:{type:String, required:true, trim:true},
        key:{type:String, required:true, trim:true}, //like HR, OPS ETC..
        description:{type:String, trim:true},
        createdBy:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true },
        nextIssueNumber:{type:Number,default:1}
    },
    {timestamps:true}
);

projectScehma.index({workspaceId:1, key:1},{unique:true})

export default mongoose.model("Project", projectScehma);