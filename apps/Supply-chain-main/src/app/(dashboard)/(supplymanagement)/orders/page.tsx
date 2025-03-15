"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Package, Calendar, User, DollarSign, PercentCircle } from "lucide-react"

interface Order {
  _id: string
  Item_Name: string
  Quantity: number
  Required_Date: string
  Supplier_Name: string
}

interface ItemDetail {
  name: string
  measuredIn: string
  VName: string
}

// Content component that uses client-side hooks
function OrderDetailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [itemDetails, setItemDetails] = useState<ItemDetail[]>([])
  const [parameterValues, setParameterValues] = useState<{ [key: string]: string | number }>({})
  const [loading, setLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const orderData = searchParams.get("orderData")
    if (orderData) {
      try {
        const parsedOrder = JSON.parse(decodeURIComponent(orderData))
        setOrder(parsedOrder)
        fetchItemDetails(parsedOrder.Item_Name)
      } catch (error) {
        console.error("Error parsing order data", error)
      } finally {
        setIsInitialLoading(false)
      }
    } else {
      setIsInitialLoading(false)
    }
  }, [searchParams])

  async function fetchItemDetails(itemName: string) {
    try {
      const response = await fetch("/api/SupplierManagement/GetItems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Item_Name: itemName }),
      })
      if (!response.ok) throw new Error("Failed to fetch item details")
      const data = await response.json()
      setItemDetails(data.data)
    } catch (error) {
      console.error("Error fetching item details:", error)
    }
  }

  function handleInputChange(param: string, value: string) {
    setParameterValues((prev) => ({ ...prev, [param]: value }))
  }

  async function handleTransaction() {
    if (!order) return
    setLoading(true)
    try {
      const transactionData = {
        Order_Id: order._id,
        Defect_Rates: parameterValues["Defect_Rates"] || 0,
        Price: parameterValues["Price"] || 0,
        Date_of_Receipt: new Date().toLocaleString(),
        ...Object.fromEntries(itemDetails.map((item) => [item.VName, parameterValues[item.VName] || 0])),
      }

      const response = await fetch("http://localhost:3000/api/SupplierManagement/MakeTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      })

      const result = await response.json()
      if (response.ok) {
        router.push("/successfully")
      } else {
        console.error("Transaction failed:", result)
      }
    } catch (error) {
      console.error("Error making transaction:", error)
    } finally {
      setLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="container max-w-3xl mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container max-w-3xl mx-auto p-6">
        <Card className="text-center py-10">
          <CardContent>
            <h2 className="text-xl font-semibold text-muted-foreground">No order data found</h2>
            <Button variant="outline" className="mt-4" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
        <p className="text-muted-foreground mt-1">Review and process the order transaction</p>
      </div>

      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Package className="mr-2 h-5 w-5 text-primary" />
              {order.Item_Name}
            </CardTitle>
            <CardDescription>Order information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium text-muted-foreground mr-2">Supplier:</span>
                <span className="font-semibold">{order.Supplier_Name}</span>
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium text-muted-foreground mr-2">Quantity:</span>
                <span className="font-semibold">{order.Quantity}</span>
              </div>
              <div className="flex items-center md:col-span-2">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium text-muted-foreground mr-2">Required Date:</span>
                <span className="font-semibold">{new Date(order.Required_Date).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold">Parameter Values</CardTitle>
            <CardDescription>Enter the required parameters for this transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {itemDetails.length > 0 && (
                <>
                  <div className="space-y-4">
                    {itemDetails.map((item, index) => (
                      <div key={index} className="grid gap-2">
                        <Label htmlFor={item.VName} className="font-medium">
                          {item.name} {item.measuredIn && `(${item.measuredIn})`}
                        </Label>
                        <Input
                          id={item.VName}
                          type="number"
                          placeholder={`Enter ${item.name} value`}
                          value={parameterValues[item.VName] || ""}
                          onChange={(e) => handleInputChange(item.VName, e.target.value)}
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    ))}
                  </div>
                  <Separator />
                </>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="defect-rates" className="font-medium flex items-center">
                    <PercentCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                    Defect Rates
                  </Label>
                  <Input
                    id="defect-rates"
                    type="number"
                    placeholder="Enter defect rate percentage"
                    value={parameterValues["Defect_Rates"] || ""}
                    onChange={(e) => handleInputChange("Defect_Rates", e.target.value)}
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price" className="font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={parameterValues["Price"] || ""}
                    onChange={(e) => handleInputChange("Price", e.target.value)}
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-4">
            <Button onClick={handleTransaction} disabled={loading} className="w-full md:w-auto" size="lg">
              {loading ? "Processing..." : "Complete Transaction"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

// Main component that wraps the content with Suspense
export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-3xl mx-auto p-6">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  )
}