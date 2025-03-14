// ProductionLineModel contains line number and employeeIds array and the status

import { connectToMongoDB } from "@/lib/mongo";
import mongoose, { Document, model, Schema } from "mongoose";

export interface IProductionLine extends Document {
    lineNo: number,
    employeeIds: Schema.Types.ObjectId[],
    status: string,
    createdAt?: Date,
    updatedAt?: Date,
}

const ProdSchema = new Schema<IProductionLine>(
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
async function initializeProductionModel(): Promise<void> {
    try {
        await connectToMongoDB();
        console.log("MongoDB Model for Order is ready.");
    } catch (error) {
        console.error("Error initializing Order model:", error);
        throw error;
    }
}

// Optionally, call initializeBlockCountModel() when the application starts
initializeProductionModel().catch(console.error);

export const OrderModel = mongoose.models.line || model<IProductionLine>("line", ProdSchema);
