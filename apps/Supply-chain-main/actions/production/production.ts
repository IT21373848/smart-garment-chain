'use server'
import { Schema } from "mongoose";
import { ProductionLineModel } from "../../models/LineModel";
import { UserModel } from "../../models/User";

export async function createProductionLine(lineNo: string, employeeIds: Schema.Types.ObjectId[]): Promise<{ status: number, message: string }> {
    try {
        console.log(lineNo, employeeIds)
        const isExist = await ProductionLineModel.findOne({ lineNo });
        if (isExist) {
            throw new Error("Production line already exists")
        }
        // Validate all employees exist
        const users = await UserModel.find({ _id: { $in: employeeIds } });
        if (users.length !== employeeIds.length) {
            throw new Error("One or more employees do not exist");
        }

        // Check if any employee is already in a production line
        const assignedLines = await ProductionLineModel.find({
            employeeIds: { $in: employeeIds }
        });

        assignedLines?.forEach((line) => {
            line.employeeIds?.forEach((id: any) => {
                const user = users.find((user) => user._id.toString() === id.toString());
                if (user) {
                    throw new Error(`${user.name} is already in a production line with line number ${line.lineNo}`);
                }
            })
        })

        if (assignedLines.length > 0) {
            throw new Error("One or more employees are already in a production line");
        }
        await ProductionLineModel.create({ lineNo, employeeIds, status: "Pending" });

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

export async function updateProductionLine(_id: string, employeeIds: Schema.Types.ObjectId[], lineNo: string): Promise<{ status: number, message: string }> {
    try {
        const isExist = await ProductionLineModel.findById(_id);
        if (!isExist) {
            throw new Error("Production line does not exist")
        }

        const users = await UserModel.find({ _id: { $in: employeeIds } });

        if (users.length !== employeeIds.length) {
            throw new Error("One or more employees do not exist");
        }

        // Check if any employee is already in a production line
        const assignedLines = await ProductionLineModel.find({
            employeeIds: { $in: employeeIds }
        });

        assignedLines?.forEach((line) => {
            if (line?._id.toString() === isExist._id.toString()) return
            line.employeeIds?.forEach((id: any) => {
                const user = users.find((user) => user._id.toString() === id.toString());
                if (user) {
                    throw new Error(`${user.name} is already in a production line with line number ${line.lineNo}`);
                }
            })
        })

        await ProductionLineModel.findByIdAndUpdate(_id, { employeeIds, lineNo: lineNo });

        return { status: 200, message: "Production line updated successfully" }
    } catch (error: any) {
        console.log(error)
        return { status: 500, message: error.message || "Error updating production line" }
    }
}
