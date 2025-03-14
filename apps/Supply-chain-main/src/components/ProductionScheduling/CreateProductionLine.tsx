'use client'
import React, { useTransition } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { IUser } from '../../../models/User'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { createProductionLine } from '../../../actions/production/production'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'



const CreateProductionLineDialog = ({ employees }: { employees: IUser[] }) => {
    const [newLine, setNewLine] = React.useState<{ lineNo: number, employeeIds: string[] }>({
        lineNo: 0,
        employeeIds: [],
    })
    const [isAdding, startLineAdding] = useTransition()
    const router = useRouter()


    const handleAddNewLine = async () => {
        startLineAdding(async () => {
            try {
                if (newLine.lineNo && newLine.employeeIds) {
                    //@ts-expect-error
                    const resp = await createProductionLine(newLine.lineNo, newLine.employeeIds)
                    router.refresh()
                } else {
                    throw new Error('All fields are required')
                }
            } catch (error: any) {
                console.log(error)
            }
        })
    }

    const removeEmployee = (id: string) => {
        setNewLine({ ...newLine, employeeIds: newLine.employeeIds.filter((empId) => empId !== id) })
    }
    return (
        <Dialog>
            <DialogTrigger className="bg-primary px-4 py-2 cursor-pointer text-white rounded-xl">Create New Line</DialogTrigger>
            <DialogContent aria-describedby={"dialog-description"} className={`custom-inner-shadow backdrop-blur-lg gap-0`}>
                <DialogDescription className='hidden'>{'Hidden Description'}</DialogDescription>
                <DialogHeader>
                    <DialogTitle className={'Add New Employee'}>
                        {'Add New Employee'}
                    </DialogTitle>
                </DialogHeader>
                <div className='my-5'>
                    <Label>Line No</Label>
                    <Input className='' type="number" placeholder="Line Number" value={newLine.lineNo} onChange={(e) => setNewLine({ ...newLine, lineNo: parseInt(e?.target?.value || '0') })} />
                </div>

                <Select
                    onValueChange={(selectedIds) => setNewLine({ ...newLine, employeeIds: [...newLine.employeeIds, selectedIds] })}
                >
                    <SelectTrigger className="bg-transparent w-full">
                        <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map((employee) => (
                            <SelectItem key={employee._id as string} value={employee._id as string}>
                                {employee.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <span>Selected Employees:</span>
                {
                    newLine.employeeIds.length > 0 ? newLine.employeeIds.map((id) => (<Button key={id} variant={'outline'} className='py-2 px-2' onClick={() => removeEmployee(id)}>{employees.find((employee) => employee._id === id)?.name}</Button>)) : ''
                }

                <Button disabled={isAdding} className="w-full" onClick={handleAddNewLine}>Create Line</Button>
            </DialogContent>
        </Dialog>
    )
}

export default CreateProductionLineDialog