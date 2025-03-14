// import dbConnect from "@/lib/db";
import { connectToMongoDB } from "@/lib/mongo";
import mongoose, { Document, model, Schema } from "mongoose";

export interface IOrder extends Document {
    orderNo: string,
    qty: number,
    deadline: Date,
    status: string,
    productionLineNo: Schema.Types.ObjectId[],
    createdAt?: Date,
    updatedAt?: Date
}

const OrderSchema = new Schema<IOrder>(
    {
        orderNo: {
            type: String,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["Pending", "In Progress", "Completed"],
        },
        productionLineNo: {
            type: [Schema.ObjectId],
            required: true,
            ref: "line",
        },
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
