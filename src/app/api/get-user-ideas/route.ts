import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Idea from "@/models/Idea";

type Idea = {
    title: string;
    problem: string;
    targetUser: string;
    industry: string;
    analysis: string;
    createdAt: Date;
};

export async function POST(req : Request){
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

    const userId = session.user._id;

    try {
        const { page = 1, limit = 5 } = await req.json();

        const skip = (page - 1) * limit;

        const totalIdeas = await Idea.countDocuments({ userId });

        const ideas = await Idea.find({ userId })
            .sort({ createdAt: -1 }) // newest first
            .skip(skip)
            .limit(limit);

        if(!ideas){
            return Response.json({
                success : false,
                message : "No ideas found"
            },{
                status : 404
            })
        }

        const formattedIdeas = ideas.map((idea : Idea) => ({
            title: idea.title,
            problem: idea.problem,
            targetUser: idea.targetUser,
            industry: idea.industry,
            analysis: idea.analysis,
            createdAt: idea.createdAt,
        }));

        return Response.json(
            {
                success: true,
                pagination: {
                    total: totalIdeas,
                    page,
                    limit,
                    totalPages: Math.ceil(totalIdeas / limit),
                },
                data: formattedIdeas,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting user ideas:", error);
        return Response.json({
            success : false,
            message : "Error getting user ideas"
        },{
            status : 500
        })
    }
}