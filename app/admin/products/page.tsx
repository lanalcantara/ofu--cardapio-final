"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search, ArrowLeft, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    subcategory?: string
    image_url?: string
    popular: boolean
    active: boolean
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isCustomCategory, setIsCustomCategory] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Doces",
        subcategory: "",
        image_url: "",
        popular: false,
    })

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products")
            const data = await response.json()
            if (data.success) {
                setProducts(data.products)
            }
        } catch (error) {
            console.error("Erro ao carregar produtos:", error)
            toast.error("Erro ao carregar produtos")
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Imagem muito grande! Máximo 5MB.")
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image_url: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product)
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category,
                subcategory: product.subcategory || "",
                image_url: product.image_url || "",
                popular: product.popular,
            })
            // Detecta se é categoria customizada (não está na lista padrão)
            const defaultCategories = ["Bolos", "Docinhos", "Gourmet", "Cookies", "Brownies", "Bebidas"]
            setIsCustomCategory(!defaultCategories.includes(product.category))
        } else {
            setEditingProduct(null)
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "Docinhos",
                subcategory: "",
                image_url: "",
                popular: false,
            })
            setIsCustomCategory(false)
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const url = editingProduct
                ? `/api/products/${editingProduct.id}`
                : "/api/products"

            const method = editingProduct ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (data.success) {
                toast.success(editingProduct ? "Produto atualizado!" : "Produto criado!")
                setIsDialogOpen(false)
                fetchProducts()
            } else {
                toast.error(data.message || "Erro ao salvar produto")
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error)
            toast.error("Erro desconhecido")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            })

            const data = await response.json()

            if (data.success) {
                toast.success("Produto removido")
                fetchProducts()
            } else {
                toast.error("Erro ao remover produto")
            }
        } catch (error) {
            toast.error("Erro ao remover produto")
        }
    }

    const categories = Array.from(new Set(products.map(p => p.category))).sort()

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-stone-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Cardápio</h1>
                            <p className="text-gray-500">Gerencie seus produtos</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' })
                            window.location.href = '/admin/login'
                        }}>
                            Sair
                        </Button>
                        <Button onClick={() => handleOpenDialog()} className="bg-red-500 hover:bg-red-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Produto
                        </Button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por nome ou categoria..."
                        className="pl-10 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* List */}
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-red-500" />
                        <p className="text-gray-500 mt-2">Carregando cardápio...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} className="overflow-hidden bg-white">
                                <div className="aspect-video w-full bg-gray-100 relative">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            Sem imagem
                                        </div>
                                    )}
                                    <Badge className="absolute top-2 right-2 bg-white/90 text-black hover:bg-white">
                                        {product.category}
                                    </Badge>
                                </div>

                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg">{product.name}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="font-bold text-red-500">
                                            R$ {product.price.toFixed(2)}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenDialog(product)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit/Create Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes do item do cardápio.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Produto</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc">Descrição</Label>
                            <Textarea
                                id="desc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Preço (R$)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria</Label>
                                <div className="space-y-2">
                                    <Select
                                        value={isCustomCategory ? "Outro" : formData.category}
                                        onValueChange={(value) => {
                                            if (value === "Outro") {
                                                setIsCustomCategory(true)
                                                setFormData({ ...formData, category: "" })
                                            } else {
                                                setIsCustomCategory(false)
                                                setFormData({ ...formData, category: value })
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Bolos">Bolos</SelectItem>
                                            <SelectItem value="Docinhos">Docinhos (Tradicionais)</SelectItem>
                                            <SelectItem value="Brigadeiros Gourmet">Brigadeiros Gourmet</SelectItem>
                                            <SelectItem value="Brownies">Brownies</SelectItem>
                                            <SelectItem value="Cupcakes">Cupcakes</SelectItem>
                                            <SelectItem value="Cookies">Cookies</SelectItem>
                                            <SelectItem value="Lembrancinhas">Lembrancinhas</SelectItem>
                                            <SelectItem value="Presentes">Presentes & Tabuleiros</SelectItem>
                                            <SelectItem value="Outro">Outro (Criar nova)</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {isCustomCategory && (
                                        <Input
                                            placeholder="Digite o nome da nova categoria"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="mt-2"
                                            autoFocus
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Imagem do Produto</Label>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2 items-center justify-center border-2 border-dashed border-red-200 rounded-xl p-6 bg-red-50 hover:bg-red-100 transition-colors w-full relative">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="cursor-pointer opacity-0 absolute inset-0 w-full h-full z-20"
                                        onChange={handleFileChange}
                                        id="file-upload"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-red-500 z-10 pointer-events-none">
                                        <div className="bg-red-500 text-white p-3 rounded-full shadow-md">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <span className="font-bold text-sm">Clique para Escolher Foto</span>
                                        <span className="text-xs text-red-400 font-medium">(Máx 5MB)</span>
                                    </div>
                                </div>

                                <div className="text-xs text-center text-gray-400 font-medium">OU (link direto)</div>

                                <Input
                                    placeholder="https://exemplo.com/foto.jpg"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                />
                                {formData.image_url && (
                                    <div className="mt-2 relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border">
                                        <img
                                            src={formData.image_url}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="popular"
                                checked={formData.popular}
                                onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                            />
                            <Label htmlFor="popular">Marcar como "Popular" (Destaque)</Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-red-500 hover:bg-red-600" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
