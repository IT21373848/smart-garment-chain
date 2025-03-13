'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { login } from '../../actions/login/login'
import { Button } from './ui/button'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const loginHandler = () => {
    startTransition(() => {
      login(username, password)?.then((data) => {
        if (data) {
          router.push('/overview')
        } else {
          setMessage(data || 'Login failed. Please try again.')
        }
      })
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button
          onClick={loginHandler}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {isPending ? 'Logging in...' : 'Login'}
        </Button>
        {isPending && (
          <div className="mt-4 text-center">
            <p>Loading...</p>
          </div>
        )}
        {message && (
          <div className="mt-4 text-center text-red-600">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
