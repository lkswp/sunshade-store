"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { loginAdmin } from "@/app/actions/admin"
import { Lock } from "lucide-react"

export default function AdminLoginPage() {
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await loginAdmin(password)

        if (res.success) {
            toast.success("Login successful")
            router.push("/admin")
        } else {
            toast.error(res.error || "Login failed")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="w-full max-w-md p-8 bg-zinc-900 rounded-2xl border border-zinc-800">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-zinc-800 rounded-full">
                        <Lock className="size-8 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Enter Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-zinc-950 border-zinc-800 text-white"
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Accessing..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
