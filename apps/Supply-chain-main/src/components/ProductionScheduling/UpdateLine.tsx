'use client'
import React, { useTransition } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { IUser } from '../../../models/User'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { updateProductionLine } from '../../../actions/production/production'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'


const UpdateProductionLineDialog = ({ line, employees }: { line: any, employees: IUser[] }) => {
    const [newLine, setNewLine] = React.useState<{ lineNo: string, employeeIds: string[] }>({
        lineNo: line?.lineNo || '',
        employeeIds: line?.employeeIds?.map((empId: any) => empId?._id?.toString()) || [],
    })

    const [isAdding, startLineAdding] = useTransition()
    const router = useRouter()


    const handleAddNewLine = async () => {
        startLineAdding(async () => {
            try {
                if (newLine.lineNo && newLine.employeeIds) {
                    // @ts-expect-error: The typescript compiler is complaining about the type of the newLine.employeeIds array because it's being inferred as an array of strings, but we know that the array contains only valid employee ids. We can bypass this error with the @ts-expect-error directive because we know that the array contains the correct type of data.
                    const resp = await updateProductionLine(line._id, newLine.employeeIds, newLine.lineNo)
                    if (resp?.status !== 200) throw new Error(resp.message)
                    toast.success('Line created successfully')
                    router.refresh()
                } else {
                    throw new Error('All fields are required')
                }
            } catch (error: any) {
                console.log(error)
                toast.error(error.message)
            }
        })
    }

    const removeEmployee = (id: string) => {
        setNewLine({ ...newLine, employeeIds: newLine.employeeIds.filter((empId) => empId !== id) })
        toast.success('Employee removed successfully')
    }
    return (
        <Dialog>
            <DialogTrigger className="bg-primary px-4 py-2 cursor-pointer text-white rounded-xl">Update</DialogTrigger>
            <DialogContent aria-describedby={"dialog-description"} className={`custom-inner-shadow backdrop-blur-lg gap-0`}>
                <DialogDescription className='hidden'>{'Hidden Description'}</DialogDescription>
                <DialogHeader>
                    <DialogTitle className={''}>
                        {'Create New Line'}
                    </DialogTitle>
                </DialogHeader>
                <div className='my-5'>
                    <Label>Line No</Label>
                    <Input className='' type="text" placeholder="Line Number" value={newLine.lineNo} onChange={(e) => setNewLine({ ...newLine, lineNo: (e?.target?.value || '') })} />
                </div>

                <Select
                    onValueChange={(selectedIds) => setNewLine({ ...newLine, employeeIds: [...newLine.employeeIds, selectedIds] })}
                >
                    <SelectTrigger className="bg-transparent w-full">
                        <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map((employee) => (
                            <SelectItem key={employee._id?.toString()} value={employee?._id?.toString() || ''}>
                                {employee.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <span>Selected Employees:</span>
                {
                    newLine.employeeIds.length > 0 ? newLine.employeeIds.map((id: string) => (<Button key={id?.toString()} variant={'outline'} className='py-2 px-2' onClick={() => removeEmployee(id)}>{employees.find((employee) => employee._id?.toString() == id?.toString())?.name}</Button>)) : ''
                }

                <Button disabled={isAdding} className="w-full" onClick={handleAddNewLine}>Update Line</Button>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProductionLineDialog