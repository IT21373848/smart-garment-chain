import { API_RESPONSE } from "@/utils/helper"
import { Params } from "next/dist/server/request/params"
import { NextRequest } from "next/server"

//THIS IS A SAMPLE API ROUTE
//API PATH IS http://localhost:3000/api/sampleAPI/:id

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const id = params.id

        if (!id) {
            throw Error("ID is required")
        }

        return API_RESPONSE(200, "success", {
            id: id,
            name: "John Doe",
            age: 30
        })
    } catch (error: any) {
        return API_RESPONSE(500, error.message, {})
    }
}