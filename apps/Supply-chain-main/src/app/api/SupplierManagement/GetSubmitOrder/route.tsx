import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongo";
import Orders from "@/models/Orders";
import SubmitTransactions from "@/models/SubmitTransaction";
import Suppliers from "@/models/Suppliers";

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();
    
    // Parse the request body
    const body = await request.json();
    const { orderId } = body;

    // Check if orderId is provided
    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get the order details
    const order = await Orders.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Get supplier information
    const supplier = await Suppliers.findById(order.Supplier_Id);
    if (!supplier) {
      return NextResponse.json({ message: "Supplier not found" }, { status: 404 });
    }

    // Get transaction details
    const transaction = await SubmitTransactions.findOne({ Order_Id: orderId });
    if (!transaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    // Combine data from all sources
    const responseData = {
      Supplier_Name: supplier.Supplier_Name,
      Item_Name: order.Item_Name,
      Quantity: order.Quantity,
      Required_Date: order.Required_Date,
      Quality: transaction.Quality,
      Price: transaction.Price,
      Defect_Rates: transaction.Defect_Rates,
      Date_of_Receipt: transaction.Date_of_Receipt,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}