'use server'
import { Schema } from "mongoose";
import { ProductionLineModel } from "../../models/LineModel";
import { UserModel } from "../../models/User";

export async function createProductionLine(lineNo: number, employeeIds: Schema.Types.ObjectId[]): Promise<{ status: number, message: string }> {
    try {
        console.log(lineNo, employeeIds)
        const isExist = await ProductionLineModel.findOne({ lineNo });
        if (isExist) {
            throw new Error("Production line already exists")
        }
        employeeIds.forEach(async (id) => {
            const isEx = await UserModel.findById(id);
            if (!isEx) {
                throw new Error("User does not exist")
            }
        })
        const productionLine = await ProductionLineModel.create({ lineNo, employeeIds, status: "Pending" });

        return { status: 200, message: "Production line created successfully" }
    } catch (error: any) {
        console.log(error)
        return { status: 500, message: error.message || "Error creating production line" }
    }
}

export async function getAllProductionLines(): Promise<{ status: number, message: string, data: any[] }> {
    try {
        const productionLines = await ProductionLineModel.find().populate("employeeIds");

        return JSON.parse(JSON.stringify({ status: 200, message: "Production lines fetched successfully", data: productionLines }))
    } catch (error: any) {
        console.log(error)
        return { status: 500, message: error.message || "Error fetching production lines", data: [] }
    }
}
