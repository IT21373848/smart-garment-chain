import mongoose, { Schema } from "mongoose";

// Define the Location Schema
const locationSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,  // Ensure the ID is unique
    },
    name: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true,
    },
});

// Define the Location model
const Location = mongoose.models.Location || mongoose.model("Location", locationSchema);

export default Location;
