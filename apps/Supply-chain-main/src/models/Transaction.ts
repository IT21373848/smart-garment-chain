import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema({
    Order_Id :{
        type: String,
        required: true
    },
    Quality :{
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

const transactions =
  mongoose.models.transactions || mongoose.model("transactions", transactionSchema);

export default transactions;