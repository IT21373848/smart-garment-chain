import mongoose, { Schema } from "mongoose";

const ItemSchema = new Schema({
    itemName: {
        type: String,
        required: true
    }
});

const suppliersSchema = new Schema({
    Supplier_Name :{
        type: String,
        required: true
    },
    items: [ItemSchema]
});

const suppliers =
  mongoose.models.suppliers || mongoose.model("suppliers", suppliersSchema);

export default suppliers;