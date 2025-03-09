import mongoose, { Schema } from "mongoose";

const ItemSchema = new Schema({
    itemName: {
        type: String,
        required: true
    }
});

const SuppliersSchema = new Schema({
    Supplier_Name :{
        type: String,
        required: true
    },
    items: [ItemSchema]
});

const Suppliers =
  mongoose.models.Suppliers || mongoose.model("Suppliers", SuppliersSchema);

export default Suppliers;