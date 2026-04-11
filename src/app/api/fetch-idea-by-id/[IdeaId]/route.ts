import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import Idea from "@/models/Idea";

// /api/fetch-idea-by-id/{IdeaId}

export async function GET(req : Request,
    {params} : {params : Promise<{IdeaId : string}>}
){
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
        const {IdeaId} = await params;

        if(!IdeaId){
            return Response.json({
                success : false,
                message : "IdeaId is required"
            },{
                status : 400
            })
        }

        const idea = await Idea.findById(IdeaId);

        if(!idea){
            return Response.json({
                success : false,
                message : "Idea not found"
            },{
                status : 404
            })
        }

        return Response.json({
            success : true,
            data : idea
        },{
            status : 200
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