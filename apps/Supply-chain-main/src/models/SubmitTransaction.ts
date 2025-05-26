import mongoose, { Schema } from "mongoose";

const submittransactionSchema = new Schema({
    Order_Id :{
        type: String,
        required: true
    },
    Quality :{
        type: String,
        required: true
    },
    Price:{
        type: Number,
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

const submittransactions =
  mongoose.models.submittransactions || mongoose.model("submittransactions", submittransactionSchema);

export default submittransactions;