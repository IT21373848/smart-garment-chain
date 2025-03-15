"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { login, registerUser } from "../../actions/login/login"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, LogIn, UserPlus, Mail, Lock, User } from "lucide-react"

export default function LoginForm() {
  const [view, setView] = useState<"login" | "register">("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [isRegisterign, startRegister] = useTransition()
  const router = useRouter()

  const loginHandler = () => {
    startTransition(() => {
      login(username, password)?.then((data) => {
        if (data?.status === 200) {
          //set cookie
          router.push("/overview")
        } else {
          setMessage(data.message || "Login failed. Please try again.")
        }
      })
    })
  }

  const registerHandler = () => {
    startRegister(() => {
      registerUser(name, username, password)?.then((data) => {
        if (data?.status === 200) {
          setView("login")
          setMessage("Registration successful. Please login.")
        } else {
          setMessage(data.message || "Registration failed. Please try again.")
        }
      })
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {view === "login" ? "Sign In" : "Create an Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {view === "login"
              ? "Enter your credentials to access your account"
              : "Fill in the details below to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {view === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {view === "login" && (
                <Button variant="link" className="px-0 text-xs" onClick={() => {}}>
                  Forgot password?
                </Button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
            {view === "login" && (
              <p className="text-xs text-muted-foreground mt-1">Demo credentials: username: admin password: admin</p>
            )}
          </div>

          {message && (
            <Alert variant={message.includes("successful") ? "default" : "destructive"} className="py-2">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={view === "login" ? loginHandler : registerHandler}
            className="w-full"
            disabled={isPending || isRegisterign}
          >
            {isPending || isRegisterign ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPending ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>
                {view === "login" ? (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" /> Create Account
                  </>
                )}
              </>
            )}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-sm text-center text-muted-foreground">
            {view === "login" ? "Don't have an account?" : "Already have an account?"}
            <Button onClick={() => setView(view === "login" ? "register" : "login")} variant="link" className="pl-1.5">
              {view === "login" ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

