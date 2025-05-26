import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongo";
import Orders from "@/models/Orders";
import SubmitTransactions from "@/models/SubmitTransaction";
import Suppliers from "@/models/Suppliers";

export async function GET() {
  try {
    await connectToMongoDB();

    // 1. Get all orders
    const allOrders = await Orders.find();

    // 2. Get all submittransactions
    const submitted = await SubmitTransactions.find();
    const submittedOrderIds = new Set(submitted.map((t) => t.Order_Id));

    // 3. Filter orders that exist in submittransactions
    const ordersWithTransactions = allOrders.filter(order =>
      submittedOrderIds.has(order._id.toString())
    );

    // 4. Enhance each order with Supplier_Name
    const results = await Promise.all(
      ordersWithTransactions.map(async (order) => {
        const supplier = await Suppliers.findOne({
          items: { $elemMatch: { itemName: order.Item_Name } },
        });

        return {
          _id: order._id,
          Supplier_Id: order.Supplier_Id,
          Item_Name: order.Item_Name,
          Quantity: order.Quantity,
          Required_Date: order.Required_Date,
          Supplier_Name: supplier ? supplier.Supplier_Name : "Unknown",
        };
      })
    );

    return NextResponse.json({ ordersWithoutTransactions: results }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
