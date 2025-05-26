import { NextRequest, NextResponse } from "next/server";
import {connectToMongoDB} from "@/lib/mongo"
import Transactions from "@/models/Transaction";
import Orders from "@/models/Orders";
import submittransactions from "@/models/SubmitTransaction";

export async function POST(request: NextRequest) {
    let body;
    try{
        
        try {
            body = await request.json();
        } catch (jsonError) {
            return NextResponse.json(
                { message: "Invalid JSON in request body" },
                { status: 400 }
            );
        }
        
        const { Order_Id, Defect_Rates,Price, Date_of_Receipt,Quality } = body;
        if (!Order_Id || !Defect_Rates || !Price || !Date_of_Receipt || !Quality) {
            return NextResponse.json(
              { message: "Missing fields" },
              { status: 400 }
            );
        }

        const db = await connectToMongoDB();
    
        const isOrderExist = await Orders.findOne({ _id: Order_Id });
        if (!isOrderExist) {
            return NextResponse.json(
              { message: "Order does not exist" },
              { status: 400 }
            );
        }
        
        await Transactions.create({
            Order_Id,
            Quality,
            Price,
            Defect_Rates,
            Date_of_Receipt
        });

        await submittransactions.deleteOne({ Order_Id });

        return NextResponse.json(
            { message: "Transaction saved successfully" },{ status: 200 }
        );

    }catch(error){
        console.error(error);
    return NextResponse.json(
      { message: "Error saving Transaction" },
      { status: 500 }
    );
    }
}