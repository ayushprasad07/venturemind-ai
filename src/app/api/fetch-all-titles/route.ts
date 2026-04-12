import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Idea from "@/models/Idea";

// /api/fetch-all-titles

type Ideas = {
    _id : string;
    title : string;
}

export async function GET(req : Request){
    await dbConnect();

    const session = await getServerSession(authOptions);

    if(!session || !session.user || !session.user._id){
        return Response.json({
            success : false,
            message : "You are not logged in"
        },{
            status : 401
        })
    }

    try {
        const ideas = await Idea.find({}) as Ideas[];

        if(!ideas){
            return Response.json({
                success : false,
                message : "No ideas found"
            },{
                status : 404
            })
        }

        return Response.json({
            success : true,
            message : "Ideas fetched successfully",
            ideas : ideas.map(idea => ({
                _id : idea._id,
                title : idea.title,
            }))
        })
    } catch (error) {
        console.log(error);
        return Response.json({
            success : false,
            message : "Something went wrong"
        },{
            status : 500
        })
    }
}