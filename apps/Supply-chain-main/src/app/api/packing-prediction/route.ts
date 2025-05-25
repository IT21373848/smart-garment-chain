import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Read the request body as JSON
    const requestBody = await request.json();

    // Send the POST request to the Python server
    const pythonResponse = await fetch("http://127.0.0.1:5001/packing-prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Send the parsed JSON request body
    });

    if (pythonResponse.ok) {
      const responseData = await pythonResponse.json(); // Parse the JSON response from Python server
      return NextResponse.json(responseData); // Return the Python server response to the client
    } else {
      // If the Python server responds with an error, return that error
      return NextResponse.json(
        { error: "Error in response from Python server" },
        { status: pythonResponse.status }
      );
    }
  } catch (error) {
    // Handle any errors that happen during the fetch request or processing
    console.error(error);
    return NextResponse.json(
      { error: "Failed to forward request to Python server" },
      { status: 500 }
    );
  }
}
