import mongoose from "mongoose";

export interface IUser{
    name : string;
    email : string;
    password : string;
    createdAt : Date;
    updatedAt : Date;
}

cosnt userschema = new mongoose.Schema<IUser>({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    }
},{
    timestamps : true
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userschema);
export default User;