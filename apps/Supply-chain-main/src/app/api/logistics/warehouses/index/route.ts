// src/app/api/logistics/warehouses/index/route.ts
import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest and NextResponse
import Location from '@/models/Location'; // Import the Location model
import { connectToMongoDB } from '@/lib/mongo';

// 1. Connect to MongoDB
async function connectToDb() {
    await connectToMongoDB();
}

// 2. GET - Fetch all warehouse locations
export async function GET(req: NextRequest) {
    try {
        await connectToDb();
        const locations = await Location.find(); // Fetch all warehouse locations from DB
        return NextResponse.json(locations, { status: 200 }); // Return the fetched locations
    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
    }
}

// 3. POST - Create a new warehouse location
export async function POST(req: NextRequest) {
    try {
        const { name, lat, lng } = await req.json(); // Parse the request body

        // Validate the incoming data
        if (!name || !lat || !lng) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Generate a unique random number for the id (you can adjust the number generation logic)
        const generateUniqueId = () => {
            // Generate a random 6-digit number. Adjust if you want a larger range.
            return Math.floor(Math.random() * 1000000);
        };

        let uniqueId = generateUniqueId();

        // Ensure the generated id is unique by checking the database
        let existingLocation = await Location.findOne({ id: uniqueId });
        
        // If the id already exists, generate a new one
        while (existingLocation) {
            uniqueId = generateUniqueId();
            existingLocation = await Location.findOne({ id: uniqueId });
        }

        // Create a new Location with the generated unique id
        const newLocation = new Location({ id: uniqueId, name, lat, lng });
        await newLocation.save();

        // Return the created location
        return NextResponse.json(newLocation, { status: 201 });
    } catch (error) {
        console.error("Error creating location:", error);
        return NextResponse.json({ error: "Failed to create warehouse" }, { status: 500 });
    }
}


// 4. PUT - Update a warehouse location
export async function PUT(req: NextRequest) {
    try {
        const { id, name, lat, lng } = await req.json(); // Parse the request body

        // Validate the incoming data
        if (!id || !name || !lat || !lng) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Find the location and update it
        const updatedLocation = await Location.findOneAndUpdate(
            { id },
            { name, lat, lng },
            { new: true } // Return the updated location
        );

        if (!updatedLocation) {
            return NextResponse.json({ error: "Location not found" }, { status: 404 });
        }

        return NextResponse.json(updatedLocation, { status: 200 });
    } catch (error) {
        console.error("Error updating location:", error);
        return NextResponse.json({ error: "Failed to update warehouse" }, { status: 500 });
    }
}

// 5. DELETE - Delete a warehouse location by ID
export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json(); // Parse the request body

        // Validate that the ID is provided
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // Delete the location
        const deletedLocation = await Location.findOneAndDelete({ id });

        if (!deletedLocation) {
            return NextResponse.json({ error: "Location not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Location deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting location:", error);
        return NextResponse.json({ error: "Failed to delete warehouse" }, { status: 500 });
    }
}
