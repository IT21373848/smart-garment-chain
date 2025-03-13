'use server'
//use server dapu files server files,but mewa frontend eke direct call krnna puluwan normal function wagema
import { UserModel } from "../../models/User"
import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
import { sign as SignFunction } from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'SECRET'

export async function login(email: string, password: string): Promise<{ token: string, message: string, status: 500 | 200 }> {
    try {
        const cookieStore = await cookies()
        //must call dbConnect before using mongoose
        console.log('Login called', email, password)
        // await dbConnect()

        const isExist = await UserModel.findOne({ email: email })

        if (!isExist) {
            throw new Error('User does not exist')
        }

        //compare password
        const isMatch = await bcrypt.compare(password, isExist.password)

        if (!isMatch) {
            throw new Error('Invalid credentials')
        }

        //generate jwt token
        const token = SignFunction({ id: isExist._id, email: isExist.email, role: isExist.role }, SECRET, { expiresIn: '1d' })

        cookieStore.set({
            name: 'token',
            value: token,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        })

        //use the mongo model here
        return {
            message: 'success',
            status: 200,
            token: ''
        }
    } catch (error: any) {
        return {
            status: 500,
            message: error.message,
            token: ''
        }
    }

    //we cannot pass complex data structures like object to frontend, ifso use
    // return JSON.parse(JSON.stringify({
    //     name: "John Doe",
    //     age: 30,
    //     user: user
    // }))
}


export async function registerUser(name: string, email: string, password: string, role: string = "admin"): Promise<{ message: string, status: 500 | 200 }> {
    try {
        // await dbConnect();

        const isExist = await UserModel.findOne({ email: email });

        if (isExist) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        return {
            message: 'User registered successfully',
            status: 200
        };
    } catch (error: any) {
        return {
            status: 500,
            message: error.message
        };
    }
}

