import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Idea from "@/models/Idea";
import { hfEmbedding } from "@/services/embedding";
import { pineconeIndex } from "@/services/pinecone";
import { generateAnalysis } from "@/services/gemeni";

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

    const userid = session.user._id;

    try {
        const {title, problem, targetUser, industry} = await req.json();

        if(!title || !problem || !targetUser || !industry){
            return Response.json({
                success : false,
                message : "All fields are required"
            },{
                status : 400
            })
        }

        const queryText = `
            Startup Idea: ${title}.
            Problem: ${problem}.
            Target Users: ${targetUser}.
            Industry: ${industry}.
        `;

        let vector: number[] = [];

        try {
            vector = await hfEmbedding(queryText);
        } catch (error) {
            console.error("Embedding failed:", error);
            return Response.json({
                success: false,
                message: "Embedding service unavailable"
            }, { status: 500 });
        }

        const result = await pineconeIndex.query({
            vector,
            topK: 10,
            includeMetadata: true,
            includeValues: false
        });

        if(!result.matches || result.matches.length === 0){
            return Response.json({
                success : false,
                message : "No idea found"
            },{
                status : 404
            })
        }

        const matches = result.matches?.map((match: any) => ({
            score: match.score,
            name: match.metadata?.name,
            industry: match.metadata?.industry,
            country: match.metadata?.country,
            description: match.metadata?.text,
        }));

        const analysis = await generateAnalysis({
            idea : queryText,
            similarStartups : matches
        });

        const saveIdea = await Idea.create({
            userId : userid,
            title,
            problem,
            targetUser,
            industry,
            analysis,
            embeddingSnippet : vector.slice(0, 100)
        });

        if(!saveIdea){
            return Response.json({
                success : false,
                message : "Something went wrong"
            },{
                status : 500
            })
        }

        return Response.json({
            success : true,
            message : "Idea saved successfully",
            data : analysis
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