import { NextRequest, NextResponse } from "next/server";
import {connectToMongoDB} from "@/lib/mongo"
import Orders from "@/models/Orders";
import Suppliers from "@/models/Suppliers";


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
        const db = await connectToMongoDB();
        
        const { Supplier_Name,Item_Name,Quantity,Required_Date} = body;
        if (!Supplier_Name || !Item_Name || !Quantity || !Required_Date) {
            return NextResponse.json(
              { message: "Missing fields" },
              { status: 400 }
            );
        }

        const isSupplierExist = await Suppliers.findOne({ Supplier_Name:Supplier_Name });
        if (!isSupplierExist) {
            return NextResponse.json(
              { message: "Supplier does not exist" },
              { status: 400 }
            );
        }

        await Orders.create({
            Supplier_Id:isSupplierExist._id,
            Item_Name,
            Quantity,
            Required_Date
        });

        return NextResponse.json(
            { message: "Order saved successfully" },{ status: 200 }
        );

    }catch(error){
        console.error(error);
    return NextResponse.json(
      { message: "Error saving Order" },
      { status: 500 }
    );
    }
}