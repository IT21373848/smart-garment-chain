import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema({
    Order_Id :{
        type: String,
        required: true
    },
    Quantity :{
        type: String,
        required: true
    },
    Defect_Rates:{
        type: Number,
        required: true
    },
    Date_of_Receipt :{
        type: Date,
        required: true
    }
});

const Transaction =
  mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default Transaction;