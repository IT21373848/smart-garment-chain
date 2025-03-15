import { NextRequest, NextResponse } from "next/server";
import {connectToMongoDB} from "@/lib/mongo"
import Suppliers from "@/models/Suppliers";


export async function GET(){
    try{
        
        const db = await connectToMongoDB();
        
        const suppliers = await Suppliers.find({}, { Supplier_Name: 1 }).lean();

        const formattedSuppliers = suppliers.map(supplier => ({
        id: supplier._id,
        Supplier_Name: supplier.Supplier_Name
        }));

        return NextResponse.json(
        { data: formattedSuppliers },
        { status: 200 }
        );

    }catch(error){
        console.error(error);
    return NextResponse.json(
      { message: "Error" },
      { status: 500 }
    );
    }
}