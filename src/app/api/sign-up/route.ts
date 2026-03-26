import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req : Request){
    await dbConnect();

    try {
        const {name, username, email, password} = await req.json();

        if(!name || !username || !email || !password){
            return Response.json({
                success : false,
                message : "All fields are required"
            },{
                status : 400
            })
        }

        const userByUsername = await User.findOne({
            username,
            isVerified : true
        })

        const userByEmail = await User.findOne({
            email,
        })

        const verificationToken = Math.floor(100000 + Math.random() * 900000);

        if(userByUsername){
            return Response.json({
                success : false,
                message : "Username already taken"
            },{
                status : 400
            })
        }

        if(userByEmail){
            if(userByEmail.isVerified){
                return Response.json({
                    success : false,
                    message : "Email already taken"
                },{
                    status : 400
                })
            }else{
                const hashedPass = await bcrypt.hash(password, 10);
                userByEmail.name = name;
                userByEmail.username = username;
                userByEmail.isVerified = true;
                userByEmail.password = hashedPass;
                userByEmail.verificationToken = verificationToken;
                userByEmail.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                await userByEmail.save();
            }
        }else{
            const hashedPass = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                username,
                email,
                password : hashedPass,
                isVerified : true,
                verificationToken,
                verificationTokenExpires : new Date(Date.now() + 24 * 60 * 60 * 1000)
            });
            await user.save();
        }

        const mailRes = await sendVerificationEmail(email, username, verificationToken.toString());

        if(!mailRes){
            return Response.json({
                success : false,
                message : "Failed to send verification email"
            },{
                status : 500
            })
        }

        return Response.json({
            success : true,
            message : "User created successfully"
        },{
            status : 200
        })
    } catch (error) {
        console.log(error);
        return Response.json({
            success : false,
            message : "Internal Server Error"
        },{
            status : 500
        })
    }
}