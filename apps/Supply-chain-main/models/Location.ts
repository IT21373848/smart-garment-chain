import { connectToMongoDB } from "@/lib/mongo";
import mongoose, { Document, model, Schema } from "mongoose";

export interface ILocation extends Document {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

const LocationSchema = new Schema<ILocation>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Initialize MongoDB connection before using the model
async function initializeLocationModel(): Promise<void> {
    try {
        await connectToMongoDB();
        console.log("MongoDB Model for Location is ready.");
    } catch (error) {
        console.error("Error initializing Location model:", error);
        throw error;
    }
}

initializeLocationModel().catch(console.error);

export const LocationModel = mongoose.models.Location || model<ILocation>("Location", LocationSchema);
