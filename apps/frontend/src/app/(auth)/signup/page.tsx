"use client"

import type React from "react"

import {useState} from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Flame, Loader2, Apple, Facebook} from "lucide-react"
import {ThemeToggle} from "@/components/theme-toggle"
import {useAuthStore} from "@/store";

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    const {register, isLoading, signUpError} = useAuthStore()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        await register(name, email, password)

        setSuccess("Account created successfully! Please check your email for verification.")


        // Redirect to login after a delay
        if (!signUpError)
            setTimeout(() => {
                router.push("/onboarding")
            }, 3000)
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
                    <h1 className="text-3xl font-bold">Create your account</h1>
                    <p className="mt-2 text-muted-foreground">Join i4you and start matching today</p>
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
                            <span className="bg-background px-2 text-muted-foreground">Or sign up with email</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="py-6"
                        />
                    </div>
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
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="py-6"
                        />
                        <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                    </div>

                    {signUpError && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{signUpError}</div>}

                    {success && <div className="rounded-md bg-success/10 p-3 text-sm text-success">{success}</div>}

                    <Button
                        className="w-full py-6 i4you-gradient hover:opacity-90 transition-opacity"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Creating account...
                            </>
                        ) : (
                            "Create account"
                        )}
                    </Button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
