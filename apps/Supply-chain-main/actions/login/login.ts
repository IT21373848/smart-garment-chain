'use server'
//use server dapu files server files,but mewa frontend eke direct call krnna puluwan normal function wagema
import { createNewEmployeeId, IUser, UserModel } from "../../models/User"
import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
import { sign as SignFunction } from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'SECRET'

export async function login(email: string, password: string): Promise<{ token: string, message: string, status: 500 | 200 }> {
    try {
        const cookieStore = await cookies()
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
        const isExist = await UserModel.findOne({ email: email });

        if (isExist) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const empid = createNewEmployeeId()

        console.log('generated id', empid)

        const newUser = new UserModel({
            name,
            email,
            empId: empid,
            password: hashedPassword,
            role,

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

export async function getAllEmployees(): Promise<{ employees: IUser[], status: number }> {
    try {
        const employees = await UserModel.find({ role: 'employee' }).select('-password');

        return JSON.parse(JSON.stringify({
            employees,
            status: 200
        }))
    } catch (error: any) {
        return {
            employees: [],
            status: 500
        }
    }
}

