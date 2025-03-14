// import dbConnect from "@/lib/db";
import { connectToMongoDB } from "@/lib/mongo";
import mongoose, { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
            enum: ["employee", "admin"],
        },
    },
    {
        timestamps: true,
    }
);


// Ensure MongoDB connection is established before using the model
async function initializeUserModel(): Promise<void> {
    try {
        await connectToMongoDB();
        console.log("MongoDB Model for User is ready.");
    } catch (error) {
        console.error("Error initializing User model:", error);
        throw error;
    }
}

// Optionally, call initializeBlockCountModel() when the application starts
initializeUserModel().catch(console.error);

export const UserModel = mongoose.models.User || model<IUser>("User", UserSchema);
