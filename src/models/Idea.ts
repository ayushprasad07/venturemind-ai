import mongoose from "mongoose";

export interface IdeaI{
    userId : mongoose.Schema.Types.ObjectId;
    title : String;
    problem : String;
    targetUser : String;
    industry : String;
    embeddedData : String[];
    createdAt : Date;
    updatedAt : Date;
}

const IdeaSchema = new mongoose.Schema<IdeaI>({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    title : {
        type : String,
        required : true,
    },
    problem : {
        type : String,
        required : true,
    },
    targetUser : {
        type : String,
        required : true,
    },
    industry : {
        type : String,
        required : true,
    },
    embeddedData : {
        type : [String],
        required : true,
    }
},{
    timestamps : true,
});
    
const Idea = mongoose.models.Idea || mongoose.model<IdeaI>("Idea", IdeaSchema);

export default Idea;