// import dbConnect from "@/lib/db";
import { connectToMongoDB } from "@/lib/mongo";
import mongoose, { Document, model, Schema } from "mongoose";

export interface IOrder extends Document {
    orderNo: string,
    qty: number,
    deadline: Date,
    status: string,
    productionLineNo: number,
    createdAt?: Date,
    updatedAt?: Date
}

const OrderSchema = new Schema<IOrder>(
    {
        orderNo: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);


// Ensure MongoDB connection is established before using the model
async function initializeOrderModel(): Promise<void> {
    try {
        await connectToMongoDB();
        console.log("MongoDB Model for Order is ready.");
    } catch (error) {
        console.error("Error initializing Order model:", error);
        throw error;
    }
}

// Optionally, call initializeBlockCountModel() when the application starts
initializeOrderModel().catch(console.error);

export const OrderModel = mongoose.models.order || model<IOrder>("order", OrderSchema);
