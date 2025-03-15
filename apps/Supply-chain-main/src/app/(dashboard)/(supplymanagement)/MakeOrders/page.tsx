"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Page() {
  const router = useRouter();
  const [items, setItems] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    requiredDate: "",
  });

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch("/api/SupplierManagement/GetItems");
        const data = await response.json();
        console.log("Fetched data:", data); // Debugging

        // Extract the correct array from "data"
        if (data && Array.isArray(data.data)) {
          setItems(data.data);
        } else {
          console.error("API response does not contain an array:", data);
          setItems([]); // Avoid map() crash
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }

    fetchItems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, itemName: value });
  };

  const handleSubmit = () => {
    router.push(`/AddOrder?${new URLSearchParams(formData).toString()}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg p-6 bg-white rounded-2xl">
        <CardContent>
          <h2 className="text-xl font-bold mb-4 text-center">Set New Order</h2>

          <div className="mb-4">
            <Label>Item Name</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an item" />
              </SelectTrigger>
              <SelectContent>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  ))
                ) : (
                  <p className="text-gray-500 p-2">No items available</p>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label>Quantity</Label>
            <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
          </div>

          <div className="mb-4">
            <Label>Required Date</Label>
            <Input type="date" name="requiredDate" value={formData.requiredDate} onChange={handleChange} />
          </div>

          <Button className="w-full mt-4" onClick={handleSubmit}>
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
