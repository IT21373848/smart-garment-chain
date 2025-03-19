'use server'
import { IOrder, OrderModel } from "../../models/OrderModel";
import { createOrderNumber } from "../../utils/functions";
import { predict } from "../predict/predict";


export async function createOrder(order: Partial<IOrder>) {
    try {
        order.orderNo = createOrderNumber();
        if(!order?.status){
            order.status = "Pending";
        }
        const newOrder = await OrderModel.create(order);

        return JSON.parse(JSON.stringify({
            status: 200,
            message: "Order created successfully",
            data: newOrder
        }))
    } catch (error: any) {
        return JSON.parse(JSON.stringify({
            status: 500,
            message: error.message || "Error creating order",
            data: error
        }))
    }
}


export async function getAllOrders(page: number = 1, limit: number = 10):Promise<{ status: number, message: string, data: any }> {
    const today = new Date();
    try {
        const skip = (page - 1) * limit;
        const orders = await OrderModel.find().populate('productionLineNo').skip(skip).limit(limit);

        console.log('Orders:', orders);

        const predictedHours = await Promise.all(orders.map(async (order) => {
            const elapsedHours = (today.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60);
            console.log('Elapsed hours:', elapsedHours);
            const resp = await predict({
                elapsed: 0,
                emp: order?.productionLineNo?.reduce((acc : number, line: any) => acc + (line?.employeeIds?.length || 0), 0) || 0,
                item: order.item,
                lines: order.productionLineNo?.length,
                qty: order.qty
            })

            return {
                ...order?._doc,
                estimatedHoursFromNow: resp.manHours - elapsedHours
            }
        }))
        const totalOrders = await OrderModel.countDocuments();

        return {
            status: 200,
            message: "Orders retrieved successfully",
            data: {
                orders: predictedHours,
                totalPages: Math.ceil(totalOrders / limit),
                currentPage: page
            }
        }
    } catch (error: any) {
        return {
            status: 500,
            message: error.message || "Error retrieving orders",
            data: error
        }
    }
}

export async function getOrderById(id: string) {
    try {
        const order = await OrderModel.findById(id);

        if (!order) {
            return {
                status: 404,
                message: "Order not found",
                data: null
            }
        }

        return {
            status: 200,
            message: "Order retrieved successfully",
            data: order
        }
    } catch (error: any) {
        return {
            status: 500,
            message: error.message || "Error retrieving order",
            data: error
        }
    }
}


export async function deleteOrderById(id: string) {
    try {
        const order = await OrderModel.findByIdAndDelete(id);

        if (!order) {
            return {
                status: 404,
                message: "Order not found",
                data: null
            }
        }

        return {
            status: 200,
            message: "Order deleted successfully",
            data: order
        }
    } catch (error: any) {
        return {
            status: 500,
            message: error.message || "Error deleting order",
            data: error
        }
    }
}


export async function updateOrderById(id: string, updateData: Partial<IOrder>) {
    try {
        const order = await OrderModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!order) {
            return {
                status: 404,
                message: "Order not found",
                data: null
            };
        }

        return {
            status: 200,
            message: "Order updated successfully",
            data: order
        };
    } catch (error: any) {
        return {
            status: 500,
            message: error.message || "Error updating order",
            data: error
        };
    }
}

