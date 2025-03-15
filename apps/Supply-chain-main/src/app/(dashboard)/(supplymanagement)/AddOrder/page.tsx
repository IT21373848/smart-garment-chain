'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function OrderDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const itemName = searchParams.get('itemName');
  const quantity = searchParams.get('quantity');
  const requiredDate = searchParams.get('requiredDate');

  const [rankedSuppliers, setRankedSuppliers] = useState<string[]>([]);
  const [newSuppliers, setNewSuppliers] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  useEffect(() => {
    if (itemName) {
      fetch('http://127.0.0.1:5001/supplier-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Item_Name: itemName })
      })
        .then(res => res.json())
        .then(data => {
          setRankedSuppliers(data.ranked_suppliers || []);
          setNewSuppliers(data.new_suppliers?.flat() || []);
        })
        .catch(err => toast.error('Failed to fetch suppliers'));
    }
  }, [itemName]);

  const handleOrder = async () => {
    if (!selectedSupplier) {
      toast.error('Please select a supplier');
      return;
    }

    try {
      const res = await fetch('/api/SupplierManagement/MakeOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Item_Name: itemName,
          Quantity: quantity,
          Required_Date: requiredDate,
          Supplier_Name: selectedSupplier
        })
      });

      if (res.status === 200) {
        toast.success('Order placed successfully!');
        router.push('./successfully');
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Order Details</h1>
        <div className="mb-6 space-y-3">
          <p className="text-lg font-medium">Item Name: <span className="text-gray-700">{itemName}</span></p>
          <p className="text-lg font-medium">Quantity: <span className="text-gray-700">{quantity}</span></p>
          <p className="text-lg font-medium">Required Date: <span className="text-gray-700">{requiredDate}</span></p>
        </div>

        <Card className="mb-6 border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-xl font-semibold">Choose Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40 border rounded-md">
              {rankedSuppliers.length + newSuppliers.length > 0 ? (
                <div className="space-y-2 p-2">
                  {rankedSuppliers.map((supplier, index) => (
                    <Button key={supplier} variant="outline" className={cn("w-full flex justify-between", selectedSupplier === supplier && "border-blue-500")}
                      onClick={() => setSelectedSupplier(supplier)}>
                      {supplier} <Badge className="bg-blue-500 text-white">Rank {index + 1}</Badge>
                    </Button>
                  ))}
                  {newSuppliers.map(supplier => (
                    <Button key={supplier} variant="outline" className={cn("w-full flex justify-between", selectedSupplier === supplier && "border-green-500")}
                      onClick={() => setSelectedSupplier(supplier)}>
                      {supplier} <Badge className="bg-green-500 text-white">New</Badge>
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No suppliers available</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Button className="w-full py-3 text-lg" onClick={handleOrder} disabled={!selectedSupplier}>
          Place Order
        </Button>
      </div>
    </div>
  );
}
