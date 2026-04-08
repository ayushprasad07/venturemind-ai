import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request){
    await dbConnect();

    try {
        const {username, verificationToken} = await req.json();

        if(!username || !verificationToken){
            return Response.json({
                success : false,
                message : "All fields are required"
            },{
                status : 400
            })
        }

        const user = await User.findOne({
            username,
            verificationToken,
        })

        if(!user){
            return Response.json({
                success : false,
                message : "Invalid verification token"
            },{
                status : 400
            })
        }

        const isValidCode = user.verificationToken === verificationToken;
        const isTokenExpired = new Date(user.verificationTokenExpires )> new Date();

        if(isValidCode && isTokenExpired){
            await User.findOneAndUpdate({
                username,
            },{
                isVerified : true,
                verificationToken : null,
                verificationTokenExpires : null
            })

            return Response.json({
                success : true,
                message : "Your account has been verified. Successfully"
            })
        }if(!isValidCode){
            return Response.json({
                success : false,
                message : "Invalid verification token"
            },{
                status : 400
            })
        }else {
            return Response.json({
                success : false,
                message : "Verification token has expired"
            },{
                status : 400
            })
        }
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