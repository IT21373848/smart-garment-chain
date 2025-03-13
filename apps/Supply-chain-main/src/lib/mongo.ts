import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToMongoDB(): Promise<void> {
    if (!MONGODB_URI) {
        console.error("MONGODB_URI is not defined in .env file.");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

process.on("SIGINT", async () => {
    console.log("Closing MongoDB connections...");
    try {
        await mongoose.disconnect();
        console.log("MongoDB connection closed.");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
    }
    process.exit(0);
});

connectToMongoDB();

export { connectToMongoDB };