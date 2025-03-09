'use server'

import dbConnect from "@/lib/db"

export async function login(username: string, password: string) {
    //must call dbConnect before using mongoose
    await dbConnect()

    //use the mongo model here
    return {
        message: 'success'
    }

    //we cannot pass complex data structures like object, ifso use
    // return JSON.parse(JSON.stringify({
    //     name: "John Doe",
    //     age: 30
    // }))
}