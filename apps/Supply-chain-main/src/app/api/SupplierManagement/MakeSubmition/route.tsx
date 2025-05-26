import { NextRequest, NextResponse } from "next/server";
import {connectToMongoDB} from "@/lib/mongo"
import Orders from "@/models/Orders";
import { checkItem } from "./processQualityItems";
import {Interlining} from "./Items/Interlining"
import { Cotton_Fabric } from "./Items/Cotton_Fabric";
import { Buttons } from "./Items/Buttons";
import { Elastic_Bands } from "./Items/Elastic_Bands";
import { Polyester_Fabric } from "./Items/Polyester_Fabric";
import { Sewing_Thread } from "./Items/Sewing Thread";
import { Silk_Fabric } from "./Items/Silk_Fabric";
import { Zippers } from "./Items/Zippers";
import submittransactions from "@/models/SubmitTransaction";

export async function POST(request: NextRequest) {
    let body;
    const qualityItems: IQuality[] = [new Buttons(),new Cotton_Fabric(),new Elastic_Bands(),new Interlining(),new Polyester_Fabric(),new Sewing_Thread(),new Silk_Fabric(),new Zippers()];
    try{
        
        try {
            body = await request.json();
        } catch (jsonError) {
            return NextResponse.json(
                { message: "Invalid JSON in request body" },
                { status: 400 }
            );
        }
        
        const { Order_Id, Defect_Rates,Price, Date_of_Receipt } = body;
        if (!Order_Id || !Defect_Rates || !Price || !Date_of_Receipt) {
            return NextResponse.json(
              { message: "Missing fields" },
              { status: 400 }
            );
        }
        let Quality = "" ;

        const db = await connectToMongoDB();
    
        const isOrderExist = await Orders.findOne({ _id: Order_Id });
        if (!isOrderExist) {
            return NextResponse.json(
              { message: "Order does not exist" },
              { status: 400 }
            );
        }
        
        const itemClass = checkItem(qualityItems, isOrderExist.Item_Name);
        if (itemClass === 0) {
            return NextResponse.json(
                { message: "Item not found" },
                { status: 500 }
              );
        } else {
            const requiredParams = itemClass.getRequiredParameters();
            const params: { [key: string]: any } = {};

            for (const param of requiredParams) {
            if (!body[param.VName]) {
                return NextResponse.json(
                { message: `Missing field: ${param.name}` },
                { status: 400 }
                );
            }
            params[param.VName] = body[param.VName];
            }
            // console.log(params)
            Quality = itemClass.calculateQuality(params).label.toString();
            // console.log(Quality);
        }

        await submittransactions.create({
            Order_Id,
            Quality,
            Price,
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