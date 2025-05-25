"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Check, Package2, Calendar, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

function OrderDetails() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const itemName = searchParams.get("itemName")
  const quantity = searchParams.get("quantity")
  const requiredDate = searchParams.get("requiredDate")

  const [rankedSuppliers, setRankedSuppliers] = useState<string[]>([])
  const [newSuppliers, setNewSuppliers] = useState<string[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_SERVER as string
  
  useEffect(() => {
    if (itemName) {
      setIsLoading(true)
      fetch(`${FLASK_API_URL}/supplier-prediction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Item_Name: itemName }),
      })
        .then((res) => res.json())
        .then((data) => {
          setRankedSuppliers(data.ranked_suppliers || [])
          setNewSuppliers(data.new_suppliers?.flat() || [])
          setIsLoading(false)
        })
        .catch((err) => {
          toast.error("Failed to fetch suppliers")
          setIsLoading(false)
        })
    }
  }, [itemName])

  const handleOrder = async () => {
    if (!selectedSupplier) {
      toast.error("Please select a supplier")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/SupplierManagement/MakeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Item_Name: itemName,
          Quantity: quantity,
          Required_Date: requiredDate,
          Supplier_Name: selectedSupplier,
        }),
      })

      if (res.status === 200) {
        toast.success("Order placed successfully!")
        router.push("./successfully")
      } else {
        toast.error("Failed to place order")
      }
    } catch (error) {
      toast.error("Failed to place order")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-muted/30">
      <Card className="w-full max-w-2xl shadow-lg border-border/40">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">Order Details</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Review your order information before placing
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex items-start gap-3">
              <Package2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Item Name</p>
                <p className="text-base font-semibold">{itemName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShoppingCart className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                <p className="text-base font-semibold">{quantity}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Required Date</p>
                <p className="text-base font-semibold">{requiredDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Select Supplier</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Choose from recommended suppliers ranked by previous performance
            </p>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-center">
                  <p className="text-muted-foreground">Loading suppliers...</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-48 border rounded-md">
                {rankedSuppliers.length + newSuppliers.length > 0 ? (
                  <div className="space-y-2 p-2">
                    {rankedSuppliers.map((supplier, index) => (
                      <Button
                        key={supplier}
                        variant="outline"
                        className={cn(
                          "w-full justify-between h-auto py-3 px-4 transition-all",
                          selectedSupplier === supplier && "border-primary bg-primary/5",
                        )}
                        onClick={() => setSelectedSupplier(supplier)}
                      >
                        <div className="flex items-center gap-2">
                          {selectedSupplier === supplier && <Check className="h-4 w-4 text-primary" />}
                          <span className="font-medium">{supplier}</span>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          Rank {index + 1}
                        </Badge>
                      </Button>
                    ))}

                    {newSuppliers.length > 0 && (
                      <>
                        <div className="relative my-3">
                          <Separator />
                          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                            New Suppliers
                          </span>
                        </div>

                        {newSuppliers.map((supplier) => (
                          <Button
                            key={supplier}
                            variant="outline"
                            className={cn(
                              "w-full justify-between h-auto py-3 px-4 transition-all",
                              selectedSupplier === supplier && "border-primary bg-primary/5",
                            )}
                            onClick={() => setSelectedSupplier(supplier)}
                          >
                            <div className="flex items-center gap-2">
                              {selectedSupplier === supplier && <Check className="h-4 w-4 text-primary" />}
                              <span className="font-medium">{supplier}</span>
                            </div>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              New
                            </Badge>
                          </Button>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground py-8">No suppliers available</p>
                  </div>
                )}
              </ScrollArea>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2">
          {selectedSupplier && (
            <div className="w-full text-sm bg-muted/50 p-3 rounded-md">
              <span className="font-medium">Selected supplier:</span> {selectedSupplier}
            </div>
          )}

          <Button
            className="w-full py-6 text-base font-medium"
            onClick={handleOrder}
            disabled={!selectedSupplier || isLoading}
          >
            {isLoading ? "Processing..." : "Place Order"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Wrap the component in Suspense to handle useSearchParams
export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
      <OrderDetails />
    </Suspense>
  )
}