import { NextRequest, NextResponse } from "next/server";
import { Buttons } from "../MakeTransaction/Items/Buttons";
import { Cotton_Fabric } from "../MakeTransaction/Items/Cotton_Fabric";
import { Elastic_Bands } from "../MakeTransaction/Items/Elastic_Bands";
import { Interlining } from "../MakeTransaction/Items/Interlining";
import { Polyester_Fabric } from "../MakeTransaction/Items/Polyester_Fabric";
import { Sewing_Thread } from "../MakeTransaction/Items/Sewing Thread";
import { Silk_Fabric } from "../MakeTransaction/Items/Silk_Fabric";
import { Zippers } from "../MakeTransaction/Items/Zippers";
import { getParametersList, ItemList } from "../MakeTransaction/processQualityItems";


export async function GET() {
    const qualityItems: IQuality[] = [new Buttons(),new Cotton_Fabric(),new Elastic_Bands(),new Interlining(),new Polyester_Fabric(),new Sewing_Thread(),new Silk_Fabric(),new Zippers()];
    try{
        
        let itemList = ItemList(qualityItems)
        return NextResponse.json(
            { data: itemList },{ status: 200 }
        );

    }catch(error){
        console.error(error);
    return NextResponse.json(
      { message: "Error" },
      { status: 500 }
    );
    }
}

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
        
        const { Item_Name } = body;
        if (!Item_Name ) {
            return NextResponse.json(
              { message: "Missing fields" },
              { status: 400 }
            );
        }
        let itemList = ItemList(qualityItems)
        if(!itemList.includes(Item_Name)){
            return NextResponse.json(
                { message: "Item not found" },
                { status: 500 }
            );
        }
        let param = getParametersList(Item_Name,qualityItems);

        return NextResponse.json(
            { data: param },{ status: 200 }
        );

    }catch(error){
        console.error(error);
    return NextResponse.json(
      { message: "Error" },
      { status: 500 }
    );
    }
}