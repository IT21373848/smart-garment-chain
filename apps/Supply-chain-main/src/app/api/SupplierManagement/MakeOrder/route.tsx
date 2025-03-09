import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db"
import Orders from "@/models/Orders";


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
        
        const { Supplier_Id,Item_Name,Price,Quantity,Required_Date} = body;
        if (!Supplier_Id || !Item_Name || !Price || !Quantity || !Required_Date) {
            return NextResponse.json(
              { message: "Missing fields" },
              { status: 400 }
            );
        }

        await Orders.create({
            Supplier_Id,
            Item_Name,
            Price,
            Quantity,
            Required_Date
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