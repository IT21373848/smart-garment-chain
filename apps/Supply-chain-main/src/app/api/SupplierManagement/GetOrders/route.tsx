import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongo";
import Orders from "@/models/Orders";
import mongoose from "mongoose";

export async function GET() {
  try {
    // Connect to MongoDB
    await connectToMongoDB();

    // Aggregate orders that do not have any matching transactions and include supplier info
    const ordersWithoutTransactions = await Orders.aggregate([
      {
        $lookup: {
          from: "transactions",
          let: { orderId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$Order_Id", "$$orderId"] },
              },
            },
          ],
          as: "transactionDocs",
        },
      },
      {
        $match: { transactionDocs: { $eq: [] } },
      },
      {
        $lookup: {
          from: "suppliers",
          let: { supplierId: "$Supplier_Id" }, // Ensure proper data type
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$supplierId" }],
                },
              },
            },
            {
              $project: {
                _id: 0,
                Supplier_Name: 1,
              },
            },
          ],
          as: "supplierDetails",
        },
      },
      {
        $unwind: {
          path: "$supplierDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          Supplier_Id: 1,
          Item_Name: 1,
          Quantity: 1,
          Required_Date: 1,
          Supplier_Name: "$supplierDetails.Supplier_Name",
        },
      },
    ]);

    return NextResponse.json(
      {
        ordersWithoutTransactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
