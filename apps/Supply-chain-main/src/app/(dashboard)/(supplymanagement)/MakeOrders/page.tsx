"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, PackageIcon, ShoppingCartIcon } from "lucide-react"

export default function Page() {
  const router = useRouter()
  const [items, setItems] = useState<string[]>([])
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    requiredDate: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchItems() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/SupplierManagement/GetItems")
        const data = await response.json()
        console.log("Fetched data:", data)

        if (data && Array.isArray(data.data)) {
          setItems(data.data)
        } else {
          console.error("API response does not contain an array:", data)
          setItems([])
        }
      } catch (error) {
        console.error("Error fetching items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, itemName: value })
  }

  const handleSubmit = () => {
    router.push(`/AddOrder?${new URLSearchParams(formData).toString()}`)
  }

  const isFormValid = formData.itemName && formData.quantity && formData.requiredDate

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-xl border-muted/20 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="bg-primary/5 border-b border-border/40 space-y-1">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-2">
            <ShoppingCartIcon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">New Order</CardTitle>
        </CardHeader>

        <CardContent className="pt-6 px-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="itemName" className="text-sm font-medium flex items-center gap-2">
                <PackageIcon className="h-4 w-4 text-muted-foreground" />
                Item Name
              </Label>
              <Select onValueChange={handleSelectChange} value={formData.itemName}>
                <SelectTrigger className="w-full border-input/60 focus:ring-1 focus:ring-primary/30">
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <p className="text-muted-foreground p-2 text-center">Loading items...</p>
                  ) : items.length > 0 ? (
                    items.map((item, index) => (
                      <SelectItem key={index} value={item} className="cursor-pointer">
                        {item}
                      </SelectItem>
                    ))
                  ) : (
                    <p className="text-muted-foreground p-2 text-center">No items available</p>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="border-input/60 focus:ring-1 focus:ring-primary/30"
                placeholder="Enter quantity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredDate" className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                Required Date
              </Label>
              <Input
                id="requiredDate"
                type="date"
                name="requiredDate"
                value={formData.requiredDate}
                onChange={handleChange}
                className="border-input/60 focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-2">
          <Button
            className="w-full transition-all duration-300 font-medium"
            onClick={handleSubmit}
            disabled={!isFormValid}
            variant={isFormValid ? "default" : "outline"}
          >
            {isFormValid ? "Submit Order" : "Complete Form to Submit"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

