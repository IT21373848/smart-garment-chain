'use client'
//if hooks are using , use client text on the top of the page is required
import { useState, useTransition } from 'react'
import { Input } from './ui/input'
//we can directly import server actions and use in frontend
import { login } from '../../actions/login/login'
import { Button } from './ui/button'

export default function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const  [isPending, startTransition] = useTransition()

    const loginHandler = () => {
        startTransition(() => {
            login(username, password)?.then((data) => {
                setSuccessMessage(data.message)
            })
        })
    }

    

    return (
        <div>
            <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={loginHandler}>Login</Button>

            {isPending && (
                <div>
                    <p>Loading...</p>
                </div>
            )}
            {successMessage && (
                <div>
                    <p>{successMessage}</p>
                </div>
            )}
        </div>
    )
}