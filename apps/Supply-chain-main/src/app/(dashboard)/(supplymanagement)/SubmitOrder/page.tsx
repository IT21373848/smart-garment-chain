"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Package2, ShoppingCart, Clock } from "lucide-react"

interface Order {
  _id: string
  Supplier_Id: string
  Item_Name: string
  Quantity: number
  Required_Date: string
  Supplier_Name: string
  __v: number
  transactionDocs: any[]
}

interface SendData {
  _id: string
  Item_Name: string
  Quantity: number
  Required_Date: string
  Supplier_Name: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        const response = await fetch("/api/SupplierManagement/GetSubmitOrders")
        const data = await response.json()
        setOrders(data.ordersWithoutTransactions)
      } catch (error) {
        console.error("Error fetching orders", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleOrderSelect = (order: Order) => {
    const data: SendData = {
      _id: order._id,
      Item_Name: order.Item_Name,
      Quantity: order.Quantity,
      Required_Date: order.Required_Date,
      Supplier_Name: order.Supplier_Name,
    }
    router.push(`/Suborders?orderId=${order._id}&orderData=${encodeURIComponent(JSON.stringify(data))}`)
  }

  // Function to calculate days remaining until required date
  const getDaysRemaining = (requiredDate: string) => {
    const today = new Date()
    const required = new Date(requiredDate)
    const diffTime = required.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Function to get badge color based on days remaining
  const getBadgeVariant = (daysRemaining: number) => {
    if (daysRemaining < 0) return "destructive"
    if (daysRemaining <= 3) return "secondary"
    if (daysRemaining <= 7) return "outline"
    return "default"
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track your supplier orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{orders.length} Orders</span>
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No Orders Found</h3>
          <p className="text-muted-foreground mt-2">There are currently no orders to display.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const daysRemaining = getDaysRemaining(order.Required_Date)
            const badgeVariant = getBadgeVariant(daysRemaining)

            return (
              <Card
                key={order._id}
                className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/50 cursor-pointer"
                onClick={() => handleOrderSelect(order)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold line-clamp-1">{order.Item_Name}</CardTitle>
                    <Badge variant={badgeVariant}>
                      {daysRemaining < 0 ? "Overdue" : daysRemaining === 0 ? "Due Today" : `${daysRemaining} days left`}
                    </Badge>
                  </div>
                  <CardDescription>Order #{order._id.substring(order._id.length - 6)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Package2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Supplier:</span>
                    <span className="text-muted-foreground">{order.Supplier_Name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Quantity:</span>
                    <span className="text-muted-foreground">{order.Quantity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Required by:</span>
                    <span className="text-muted-foreground">
                      {new Date(order.Required_Date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t bg-muted/30">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>
                      {daysRemaining < 0
                        ? `${Math.abs(daysRemaining)} days overdue`
                        : daysRemaining === 0
                          ? "Due today"
                          : `Due in ${daysRemaining} days`}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

