import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    );
}

type Connection = {
    isConnected: number;
};

let cachedConn: Connection;

async function dbConnect() {
    if (cachedConn && cachedConn.isConnected === 1) {
        return cachedConn;
    }

    if (!cachedConn) {
        cachedConn = {
            isConnected: 0,
        };
    }

    try {
        await mongoose.connect(MONGO_URI!);
        cachedConn.isConnected = mongoose.connections[0].readyState;
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
    return cachedConn;
}

export default dbConnect;