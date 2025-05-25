import { NextResponse } from "next/server";

export const API_RESPONSE = (status: number, message: string, data: any): NextResponse => {
    return NextResponse.json({
        status, message, data: {
            ...data
        }
    });
}

export const isOrderDue = (estimatedDeadline: Date, deadline: Date) => estimatedDeadline > deadline