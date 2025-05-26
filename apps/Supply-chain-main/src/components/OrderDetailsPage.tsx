"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Calendar, DollarSign, Building2, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface OrderResponse {
  Supplier_Name: string
  Item_Name: string
  Quantity: number
  Required_Date: string
  Quality: string
  Price: number
  Defect_Rates: number
  Date_of_Receipt: string
}

export default function OrderDetailsPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderDetails, setOrderDetails] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (orderId) {
      fetch("/api/SupplierManagement/GetSubmitOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setOrderDetails(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching order details:", err)
          toast.error("Failed to load order details. Please try again.")
          setLoading(false)
        })
    }
  }, [orderId])

  const handleTransaction = async (accept: boolean) => {
    if (!orderId || !orderDetails) return

    setProcessing(true)
    const { Defect_Rates, Price, Date_of_Receipt, Quality } = orderDetails

    const body = {
      Order_Id: orderId,
      Defect_Rates: accept ? Defect_Rates : 100,
      Price,
      Date_of_Receipt,
      Quality,
    }

    try {
      const response = await fetch("/api/SupplierManagement/MakeTransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        if (accept) {
          toast.success(`Order #${orderId} has been accepted successfully.`)
          window.location.href = "/TrackOrders"
        } else {
          toast.error(`Order #${orderId} has been rejected.`)
          window.location.href = "/TrackOrders"
        }
      } else {
        throw new Error(data.message || "Transaction failed")
      }
    } catch (err) {
      console.error("Error processing transaction:", err)
      toast.error("Unable to process the order. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  const getQualityBadge = (quality: string) => {
    const qualityLower = quality.toLowerCase()
    if (qualityLower.includes("high") || qualityLower.includes("excellent")) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          High Quality
        </Badge>
      )
    } else if (qualityLower.includes("medium") || qualityLower.includes("good")) {
      return <Badge variant="secondary">Medium Quality</Badge>
    } else {
      return <Badge variant="destructive">Low Quality</Badge>
    }
  }

  const getDefectRateStatus = (rate: number) => {
    if (rate <= 5) return { color: "text-green-600", icon: CheckCircle, label: "Excellent" }
    if (rate <= 15) return { color: "text-yellow-600", icon: AlertTriangle, label: "Acceptable" }
    return { color: "text-red-600", icon: XCircle, label: "Poor" }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground text-center">
              Unable to load order details. Please check the order ID and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const defectStatus = getDefectRateStatus(orderDetails.Defect_Rates)
  const DefectIcon = defectStatus.icon

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Review</h1>
          <p className="text-muted-foreground">Order ID: #{orderId}</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Clock className="w-4 h-4 mr-1" />
          Pending Review
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                  <p className="text-lg font-semibold">{orderDetails.Supplier_Name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Item</p>
                  <p className="text-lg font-semibold">{orderDetails.Item_Name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {orderDetails.Quantity.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold text-green-600">${orderDetails.Price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Required Date</p>
                  <p className="text-lg font-semibold">
                    {new Date(orderDetails.Required_Date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Receipt</p>
                  <p className="text-lg font-semibold">
                    {new Date(orderDetails.Date_of_Receipt).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Quality Rating</p>
                  {getQualityBadge(orderDetails.Quality)}
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Defect Rate</p>
                  <div className="flex items-center gap-2">
                    <DefectIcon className={`h-5 w-5 ${defectStatus.color}`} />
                    <span className="text-lg font-semibold">{orderDetails.Defect_Rates}%</span>
                    <Badge variant="outline" className={defectStatus.color}>
                      {defectStatus.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleTransaction(true)}
              disabled={processing}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {processing ? "Processing..." : "Accept Order"}
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="flex-1"
              onClick={() => handleTransaction(false)}
              disabled={processing}
            >
              <XCircle className="w-5 h-5 mr-2" />
              {processing ? "Processing..." : "Reject Order"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
