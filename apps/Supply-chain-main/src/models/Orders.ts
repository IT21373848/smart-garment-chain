import mongoose, { Schema } from "mongoose";

const ordersSchema = new Schema({
    Supplier_Id :{
        type: String,
        required: true
    },
    Item_Name :{
        type: String,
        required: true
    },
    Price:{
        type: Number,
        required: true
    },
    Quantity :{
        type: Number,
        required: true
    },
    Required_Date :{
        type: Date,
        required: true
    }
});

const orders =
  mongoose.models.orders || mongoose.model("orders", ordersSchema);

export default orders;