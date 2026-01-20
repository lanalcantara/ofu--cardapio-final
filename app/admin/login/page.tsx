"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock, Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (data.success) {
                router.push("/admin/products")
                router.refresh()
            } else {
                setError(data.message || "Senha incorreta")
            }
        } catch (err) {
            setError("Ocorreu um erro ao tentar entrar.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF8F5] p-4">
            <Card className="w-full max-w-md shadow-xl border-none">
                <CardHeader className="text-center space-y-4 pb-2">
                    <div className="mx-auto bg-red-50 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                        <Lock className="h-8 w-8 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-serif font-bold text-gray-800">Acesso Restrito</CardTitle>
                    <CardDescription>Área exclusiva para gerenciamento da Ofuê</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Administrativo</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@ofue.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha de Acesso</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 text-lg pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 h-12 text-lg font-bold"
                            disabled={loading || !password || !email}
                        >
                            {loading ? "Entrando..." : "Acessar Painel"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
