import mongoose, { Schema } from "mongoose";

const SuppliersSchema = new Schema({
    Supplier_Id :{
        type: String,
        required: true
    },
    Supplier_Name :{
        type: String,
        required: true
    }
});

const Suppliers =
  mongoose.models.Suppliers || mongoose.model("Suppliers", SuppliersSchema);

export default Suppliers;