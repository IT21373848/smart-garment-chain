'use server'
import { IOrder, OrderModel } from "../../models/OrderModel";
import { createOrderNumber } from "../../utils/functions";


export async function createOrder(order: Partial<IOrder>) {
    try {
        order.orderNo = createOrderNumber();
        if(!order?.status){
            order.status = "Pending";
        }
        const newOrder = await OrderModel.create(order);

        return {
            status: 200,
            message: "Order created successfully",
            data: newOrder
        }
    } catch (error: any) {
        return {
            status: 500,
            message: error.message || "Error creating order",
            data: error
        }
    }
}

export async function getAllOrders(page: number = 1, limit: number = 10) {
    try {
        const skip = (page - 1) * limit;
        const orders = await OrderModel.find().skip(skip).limit(limit);
        const totalOrders = await OrderModel.countDocuments();

        return {
            status: 200,
            message: "Orders retrieved successfully",
            data: {
                orders,
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

