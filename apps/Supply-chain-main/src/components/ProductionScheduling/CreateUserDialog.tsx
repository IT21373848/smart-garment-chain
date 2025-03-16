'use client'
import React, { useTransition } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { IUser } from '../../../models/User'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { registerUser } from '../../../actions/login/login'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


const CreateUserDialog = () => {
    const [newUser, setNewUser] = React.useState<Partial<IUser>>({
        name: '',
        email: '',
        password: '',
        role: ''
    })
    const [isAdding, startUserAdding] = useTransition()
    const router = useRouter()


    const handleAddNewUser = async () => {
        startUserAdding(async () => {
            try {
                if (newUser.name && newUser.email && newUser.password) {
                    const resp = await registerUser(newUser.name, newUser.email, newUser.password, 'employee')
                    if(resp?.status !== 200) throw new Error(resp.message)
                    toast.success('User created successfully')
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
    return (
        <Dialog>
            <DialogTrigger className="bg-primary px-4 py-2 cursor-pointer text-white rounded-xl">Create User</DialogTrigger>
            <DialogContent aria-describedby={"dialog-description"} className={`custom-inner-shadow backdrop-blur-lg gap-0`}>
                <DialogDescription className='hidden'>{'Hidden Description'}</DialogDescription>
                <DialogHeader>
                    <DialogTitle className={'Add New Employee'}>
                        {'Add New Employee'}
                    </DialogTitle>
                </DialogHeader>
                <div className='my-5'>
                    <Label>Name</Label>
                    <Input className='' type="text" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                </div>
                <div className='my-5'>
                    <Label>Email</Label>
                    <Input className='' type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                </div>
                <div className='my-5'>
                    <Label>Passoword</Label>
                    <Input className='' type="text" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                </div>

                <Button disabled={isAdding} className="w-full" onClick={handleAddNewUser}>Create User</Button>
            </DialogContent>
        </Dialog>
    )
}

export default CreateUserDialog