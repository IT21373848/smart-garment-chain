'use client'
import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { convertToTimeRemaining } from '../../../utils/functions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { CLOTHING_ITEMS } from '../../../config/config'
type Props = {
    invc: any
}

const UpdateProductionModal = ({ invc }: Props) => {
    const [invoice, setInvoice] = React.useState(JSON.parse(invc))

    const updateField = (key: string, value: any) => {
        setInvoice({
            ...invoice,
            [key]: value,
        })
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Update
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Production</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="name">Production No</Label>
                            <Input id="name" value={invoice.orderNo} disabled />
                        </div>
                        <Select
                            defaultValue={invoice.itemName}
                            value={invoice.itemName}
                            onValueChange={(value) => updateField('itemName', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={invoice.itemName} />
                            </SelectTrigger>
                            <SelectContent>
                                {CLOTHING_ITEMS.map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="name">Production Lines</Label>
                            <Input id="name" value={invoice?.productionLineNo?.length} disabled />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="name">Employees</Label>
                            <Input id="name" value={invoice?.productionLineNo?.reduce((total: number, line: any) => total + line?.employeeIds?.length, 0)} disabled />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="name">QTY</Label>
                            <Input id="name" value={invoice.qty} onChange={(e) => updateField('qty', e.target.value)} />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="name">Created At</Label>
                            <Input id="name" value={new Date(invoice.createdAt).toDateString()} disabled />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="name">Actual Deadline</Label>
                            <Input id="name" value={new Date(invoice.deadline).toDateString()} onChange={(e) => updateField('deadline', e.target.value)} />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="name">Production Ends in (Estimated)</Label>
                            <Input id="name" value={convertToTimeRemaining(invoice?.estimatedHoursFromNow)} disabled />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="submit">Update</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProductionModal