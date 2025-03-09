import mongoose, { Schema } from "mongoose";

const OrdersSchema = new Schema({
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

const Orders =
  mongoose.models.Orders || mongoose.model("Orders", OrdersSchema);

export default Orders;