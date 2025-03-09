import { API_RESPONSE } from "@/utils/helper"
import { NextRequest } from "next/server"

//THIS IS A SAMPLE API ROUTE
//API PATH IS http://localhost:3000/api/sampleAPI/:id

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
try{
    const id = params.id
    
    return API_RESPONSE(200, "success", {
        id: id,
        name: "John Doe",
        age: 30
    })
}catch(error:any){
    return API_RESPONSE(500, error.message, {})
}
}