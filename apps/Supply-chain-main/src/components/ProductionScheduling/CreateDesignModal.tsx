'use client'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { IDesign } from '../../../models/DesignModel'
import { createDesign } from '../../../actions/design/design'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { CLOTHING_ITEMS } from '../../../config/config'

const CreateDesignModal = () => {
    const [isAdding, startAdding] = React.useTransition()
    const [design, setDesign] = React.useState<Partial<IDesign>>({
        id: '',
        name: '',
        typeOfGarment: CLOTHING_ITEMS[0]
    });

    const handleAddDesign = () => {
        startAdding(async () => {
            try {
                const resp = await createDesign(design as IDesign)
                if (resp?.status !== 200) throw new Error(resp.msg)
                toast.success(resp?.msg || 'Line created successfully')
            } catch (error: any) {
                console.log(error)
                toast.error(error.message)
            }
        })

    }
    return (
        <Dialog>
            <DialogTrigger className="bg-primary px-4 py-2 cursor-pointer text-white rounded-xl">Create Design</DialogTrigger>
            <DialogContent aria-describedby={"dialog-description"} className={`custom-inner-shadow backdrop-blur-lg gap-0`}>
                <DialogDescription className='hidden'>{'Hidden Description'}</DialogDescription>
                <DialogHeader>
                    <DialogTitle className={'Add New Design'}>
                        {'Add New Design'}
                    </DialogTitle>
                </DialogHeader>
                <div className='my-5'>
                    <Label>Id</Label>
                    <Input className='' type="text" placeholder="Id" value={design.id} onChange={(e) => setDesign({ ...design, id: e.target.value })} />
                </div>
                <div className='my-5'>
                    <Label>Name</Label>
                    <Input className='' type="text" placeholder="Name" value={design.name} onChange={(e) => setDesign({ ...design, name: e.target.value })} />
                </div>

                <Label className='mb-2'>Type Of Garment</Label>
                <Select
                    value={design.typeOfGarment}
                    onValueChange={(value) => setDesign({ ...design, typeOfGarment: value })}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                        {CLOTHING_ITEMS.map((item) => (
                            <SelectItem key={item} value={item}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <br />
                <Button disabled={isAdding} className="w-full" onClick={handleAddDesign}>Create Design</Button>
            </DialogContent>
        </Dialog>
    )
}

export default CreateDesignModal