"use client"

import type React from "react"

import {useState} from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Flame, Loader2, Apple, Facebook} from "lucide-react"
import {useAuthStore} from "@/store"
import {ThemeToggle} from "@/components/theme-toggle"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const {login, isLoading, error} = useAuthStore()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        await login(email, password)
        if (!error)
            router.push("/discover")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle/>
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="i4you-gradient p-4 rounded-full">
                            <Flame className="h-10 w-10 text-white"/>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold">Sign in to i4you</h1>
                    <p className="mt-2 text-muted-foreground">Welcome back! Please enter your details</p>
                </div>

                <div className="space-y-4">
                    <Button variant="outline" className="w-full py-6 relative">
                        <Apple className="h-5 w-5 absolute left-4"/>
                        <span>Continue with Apple</span>
                    </Button>

                    <Button variant="outline" className="w-full py-6 relative">
                        <Facebook className="h-5 w-5 absolute left-4 text-blue-600"/>
                        <span>Continue with Facebook</span>
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"/>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="py-6"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="py-6"
                        />
                    </div>

                    {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                    <Button
                        type="submit"
                        className="w-full py-6 i4you-gradient hover:opacity-90 transition-opacity"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
