"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, MapPin, Phone, LogOut, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function AccountPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: ""
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        // Checar login
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
                return
            }
            setUser(user)

            // Carregar dados salvos localmente (ou do banco no futuro)
            const savedData = localStorage.getItem("ofu_customer_info")
            if (savedData) {
                setFormData(JSON.parse(savedData))
            } else {
                // Tenta preencher nome com email/metadata se não tiver nada salvo
                setFormData(prev => ({ ...prev, name: user.user_metadata?.full_name || "" }))
            }
            setLoading(false)
        }
        checkUser()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    const handleSave = async () => {
        setSaving(true)
        // Por enquanto, salva no LocalStorage para usar no checkout
        localStorage.setItem("ofu_customer_info", JSON.stringify(formData))

        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 800))

        toast({
            title: "Dados atualizados!",
            description: "Suas informações foram salvas para facilitar seus pedidos.",
            className: "bg-green-50 border-green-200 text-green-800"
        })
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDF8F5]">
                <Loader2 className="h-8 w-8 animate-spin text-red-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDF8F5] p-4 font-sans">
            <div className="max-w-md mx-auto space-y-6 pt-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center text-red-500 hover:text-red-700 font-bold transition-colors">
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Voltar ao Menu
                    </Link>
                    <h1 className="text-2xl font-fredoka text-[#FF8C00]">Minha Conta</h1>
                </div>

                {/* Perfil */}
                <Card className="border-none shadow-md bg-white overflow-hidden">
                    <CardHeader className="bg-[#ffc2d1]/30 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center border-2 border-white shadow-sm">
                                <User className="h-8 w-8 text-red-400" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-[#8B0000]">{user.email?.split('@')[0]}</CardTitle>
                                <CardDescription className="text-gray-500">{user.email}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#FF8C00] rounded-full block"></span>
                                Meus Dados de Entrega
                            </h3>
                            <p className="text-sm text-gray-500">Mantenha seus dados atualizados para agilizar seus pedidos.</p>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Seu Nome Completo</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            className="pl-9 bg-gray-50"
                                            placeholder="Como gosta de ser chamado"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            className="pl-9 bg-gray-50"
                                            placeholder="(81) 99999-9999"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="address">Endereço Completo</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="address"
                                            className="pl-9 bg-gray-50"
                                            placeholder="Rua, Número, Bairro, Compl."
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-[#FF8C00] hover:bg-[#e67e00] text-white font-bold h-12 rounded-xl mt-4"
                            >
                                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Salvar Alterações"}
                            </Button>
                        </div>

                        <Separator />

                        <div className="pt-2">
                            <Button variant="outline" className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 border-red-100" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Sair da Conta
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
