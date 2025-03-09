'use server'
//use server dapu files server files,but mewa frontend eke direct call krnna puluwan normal function wagema

import dbConnect from "@/lib/db"

export async function login(username: string, password: string) {
    //must call dbConnect before using mongoose
    console.log('Login called', username, password)
    await dbConnect()

    //use the mongo model here
    return {
        message: 'success'
    }

    //we cannot pass complex data structures like object to frontend, ifso use
    // return JSON.parse(JSON.stringify({
    //     name: "John Doe",
    //     age: 30,
    //     user: user
    // }))
}