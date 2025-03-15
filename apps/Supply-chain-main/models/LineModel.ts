// import dbConnect from "@/lib/db";
import { connectToMongoDB } from "@/lib/mongo";
import mongoose, { Document, model, Schema } from "mongoose";

export interface IProdLine extends Document {
   lineNo: number;
   employeeIds: Schema.Types.ObjectId[];
   status: string;
}

const IProdLineSchema = new Schema<IProdLine>(
    {
        lineNo: {
            type: Number,
            required: true,
        },
        employeeIds: {
            type: [Schema.ObjectId],
            required: true,
            ref: "User",
        },
        status: {
            type: String,
            required: true,
            enum: ["Pending", "In Progress", "Completed"],
        },
    },
    {
        timestamps: true,
    }
);


// Ensure MongoDB connection is established before using the model
async function initializeIprodModel(): Promise<void> {
    try {
        await connectToMongoDB();
        console.log("MongoDB Model for ProdLine is ready.");
    } catch (error) {
        console.error("Error initializing ProdLine model:", error);
        throw error;
    }
}

// Optionally, call initializeBlockCountModel() when the application starts
initializeIprodModel().catch(console.error);

export const ProductionLineModel = mongoose.models.line || model<IProdLine>("line", IProdLineSchema);
