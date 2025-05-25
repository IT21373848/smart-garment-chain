import { connectToMongoDB } from "@/lib/mongo";
import mongoose, { Document, model, Schema } from "mongoose";
import { CLOTHING_ITEMS } from "../config/config";
export interface IDesign extends Document {
    id: string;
    name: string;
    typeOfGarment: string;
}

const DesignSchema = new Schema<IDesign>(
    {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        typeOfGarment: {
            type: String,
            required: true,
            enum: CLOTHING_ITEMS
        },
    },
    {
        timestamps: true,
    }
);

export const DesignModel = mongoose.models.design || model<IDesign>("design", DesignSchema);

// Ensure MongoDB connection is established before using the model
async function initializeIDesignModel(): Promise<void> {
    try {
        await connectToMongoDB();
        console.log("MongoDB Model for IDesign is ready.");
    } catch (error) {
        console.error("Error initializing IDesign model:", error);
        throw error;
    }
}

// Optionally, call initializeBlockCountModel() when the application starts
initializeIDesignModel().catch(console.error);


