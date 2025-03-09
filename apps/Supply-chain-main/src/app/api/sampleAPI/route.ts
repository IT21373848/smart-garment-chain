//THIS IS A SAMPLE API ROUTE
//API PATH IS http://localhost:3000/api/sampleAPI

import dbConnect from "@/lib/db";
import { API_RESPONSE } from "@/utils/helper";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
try{
    await dbConnect()
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get('name')

    return API_RESPONSE(200, "success", {
        name: "John Doe",
        age: 30
    })
}catch(error:any){
    return API_RESPONSE(500, error.message, {})
}
}


export async function POST(request: NextRequest) {
try{
    const body = await request.json();
    return API_RESPONSE(200, "success", {})
}catch(error:any){
    return API_RESPONSE(500, error.message, {})
}
}