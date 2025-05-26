import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongo";
import Orders from "@/models/Orders";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToMongoDB();

    // Aggregate orders without matching transactions OR submittransactions
    const ordersWithoutTransactions = await Orders.aggregate([
      // Lookup in transactions collection
      {
        $lookup: {
          from: "transactions",
          let: { orderId: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$Order_Id", "$$orderId"] } } }
          ],
          as: "transactionDocs"
        }
      },
      // Lookup in submittransactions collection
      {
        $lookup: {
          from: "submittransactions",
          let: { orderId: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$Order_Id", "$$orderId"] } } }
          ],
          as: "submitTransactionDocs"
        }
      },
      // Match orders with empty results in both lookups
      {
        $match: {
          $and: [
            { transactionDocs: { $eq: [] } },
            { submitTransactionDocs: { $eq: [] } }
          ]
        }
      },
      // Include supplier information
      {
        $lookup: {
          from: "suppliers",
          let: { supplierId: "$Supplier_Id" },
          pipeline: [
            { 
              $match: { 
                $expr: { $eq: ["$_id", { $toObjectId: "$$supplierId" }] } 
              } 
            },
            { $project: { _id: 0, Supplier_Name: 1 } }
          ],
          as: "supplierDetails"
        }
      },
      { $unwind: { path: "$supplierDetails", preserveNullAndEmptyArrays: true } },
      // Project final fields
      {
        $project: {
          _id: 1,
          Supplier_Id: 1,
          Item_Name: 1,
          Quantity: 1,
          Required_Date: 1,
          Supplier_Name: "$supplierDetails.Supplier_Name"
        }
      }
    ]);

    // Existing filter to exclude specific IDs
    const targetIds = [
      "67d6848a45729750266d85a7",
      "67d684ae2fdcb4670b7c9282",
      "67d685592fdcb4670b7c9286",
      "67d6855b2fdcb4670b7c9288",
      "67d6856c2fdcb4670b7c928a",
      "67d685a52fdcb4670b7c928c"
    ];
    
    const filteredOrders = ordersWithoutTransactions.filter(
      order => !targetIds.includes(order._id.toString())
    );
    
    return NextResponse.json(
      { ordersWithoutTransactions: filteredOrders },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}