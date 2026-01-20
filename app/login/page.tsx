"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, ArrowRight, Eye, EyeOff, Check, X, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Inicializar cliente Supabase no frontend
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CustomerLoginPage() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    // Login States
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Register States
    const [regName, setRegName] = useState("")
    const [regEmail, setRegEmail] = useState("")
    const [regPassword, setRegPassword] = useState("")

    // Password Validation
    const hasMinLength = regPassword.length >= 8
    const hasUpperCase = /[A-Z]/.test(regPassword)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(regPassword)
    const isPasswordStrong = hasMinLength && hasUpperCase && hasSpecialChar

    const handleLogin = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        setLoading(false)

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao entrar",
                description: "Verifique seu email e senha e tente novamente.",
            })
        } else {
            toast({
                title: "Bem-vindo(a) de volta!",
                description: "Login realizado com sucesso.",
            })
            router.push("/")
        }
    }

    const handleRegister = async () => {
        if (!isPasswordStrong) {
            toast({
                variant: "destructive",
                title: "Senha fraca",
                description: "Sua senha precisa atender aos requisitos de segurança.",
            })
            return
        }

        setLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email: regEmail,
            password: regPassword,
            options: {
                data: {
                    full_name: regName,
                },
            },
        })
        setLoading(false)

        if (error) {
            console.error("Erro no cadastro:", error) // Debug

            let errorMessage = "Ocorreu um erro ao criar a conta."
            if (error.message.includes("security purposes")) {
                errorMessage = "Muitas tentativas. Aguarde 1 minuto antes de tentar novamente."
            } else if (error.message.includes("already registered")) {
                errorMessage = "Este email já está cadastrado. Tente fazer login."
            } else {
                errorMessage = error.message
            }

            toast({
                variant: "destructive",
                title: "Atenção",
                description: errorMessage,
            })
        } else {
            console.log("Cadastro sucesso:", data)
            toast({
                title: "Conta criada com sucesso!",
                description: "Tentando fazer login automático...",
            })

            // Tentar login automático
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: regEmail,
                password: regPassword,
            })

            if (!loginError) {
                router.push("/")
            } else {
                toast({
                    title: "Verifique seu email",
                    description: "Enviamos um link de confirmação para você.",
                })
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF8F5] p-4">
            <Card className="w-full max-w-md shadow-xl border-none">
                <CardHeader className="text-center space-y-4 pb-6">
                    <div className="mx-auto bg-red-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                        <ShoppingBag className="h-10 w-10 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-fredoka font-bold text-[#FF8C00]">Minha Conta Ofuê</CardTitle>
                    <CardDescription className="font-quicksand font-bold text-[#8B0000]">Acompanhe seus pedidos e favoritos</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-red-50">
                            <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-red-500 font-bold font-fredoka">Já sou cliente</TabsTrigger>
                            <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:text-red-500 font-bold font-fredoka">Criar conta</TabsTrigger>
                        </TabsList>

                        {/* LOGIN TAB */}
                        <TabsContent value="login" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-quicksand font-bold text-[#8B0000]">E-mail</Label>
                                <Input
                                    id="email"
                                    placeholder="exemplo@email.com"
                                    className="font-quicksand font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="font-quicksand font-bold text-[#8B0000]">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button className="w-full bg-red-500 hover:bg-red-600 font-bold h-12 font-fredoka text-lg" onClick={handleLogin} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Entrar
                            </Button>
                        </TabsContent>

                        {/* REGISTER TAB */}
                        <TabsContent value="register" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reg-name" className="font-quicksand font-bold text-[#8B0000]">Nome Completo</Label>
                                <Input
                                    id="reg-name"
                                    placeholder="Seu nome"
                                    className="font-quicksand font-medium"
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-email" className="font-quicksand font-bold text-[#8B0000]">E-mail</Label>
                                <Input
                                    id="reg-email"
                                    placeholder="seu@email.com"
                                    className="font-quicksand font-medium"
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-pass" className="font-quicksand font-bold text-[#8B0000]">Criar Senha Segura</Label>
                                <div className="relative">
                                    <Input
                                        id="reg-pass"
                                        type={showPassword ? "text" : "password"}
                                        className="pr-10"
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Requisitos de Senha */}
                                <div className="bg-red-50 p-3 rounded-lg space-y-2 text-xs font-quicksand font-bold text-[#8B0000] mt-2 border border-red-100">
                                    <p className="font-bold mb-1">Sua senha deve ter:</p>
                                    <div className={`flex items-center gap-2 ${hasMinLength ? "text-green-600" : "text-red-400"}`}>
                                        {hasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                        Mínimo 8 caracteres
                                    </div>
                                    <div className={`flex items-center gap-2 ${hasUpperCase ? "text-green-600" : "text-red-400"}`}>
                                        {hasUpperCase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                        Pelo menos 1 letra maiúscula
                                    </div>
                                    <div className={`flex items-center gap-2 ${hasSpecialChar ? "text-green-600" : "text-red-400"}`}>
                                        {hasSpecialChar ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                        Caractere especial (!@#$...)
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-red-500 hover:bg-red-600 font-bold h-12 font-fredoka text-lg mt-4 disabled:opacity-50"
                                onClick={handleRegister}
                                disabled={loading || !isPasswordStrong || !regEmail || !regName}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar Conta Segura"}
                            </Button>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 transition-colors font-quicksand font-bold">
                            Voltar para a loja <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
