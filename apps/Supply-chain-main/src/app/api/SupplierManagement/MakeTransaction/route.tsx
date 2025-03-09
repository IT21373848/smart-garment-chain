import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db"
import Transaction from "@/models/Transaction";


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
        const db = await dbConnect();

        const { Order_Id, Quality, Defect_Rates, Date_of_Receipt } = body;
        if (!Order_Id || !Quality || !Defect_Rates || !Date_of_Receipt) {
            return NextResponse.json(
              { message: "Missing fields" },
              { status: 400 }
            );
        }

        await Transaction.create({
            Order_Id,
            Quality,
            Defect_Rates,
            Date_of_Receipt
        });

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