"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Phone, MapPin, Clock, Instagram, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useProducts } from "@/hooks/useProducts"
import { useCart } from "@/hooks/useCart"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: "bolos" | "doces" | "especiais"
  subcategory?: "brigadeiros" | "cookies" | "outros"
  image: string
  popular?: boolean
}

export default function Component() {
  const { products, loading, error } = useProducts()
  const { cart, addToCart, removeFromCart, getCartTotal, getCartItemsCount, submitOrder, isSubmitting } = useCart()

  const [activeCategory, setActiveCategory] = useState<string>("todos")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("todos")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    observations: "",
  })

  const filteredProducts = products.filter((product) => {
    if (activeCategory === "todos") return true
    if (activeCategory !== product.category) return false
    if (activeCategory === "doces" && activeSubcategory !== "todos") {
      return product.subcategory === activeSubcategory
    }
    return true
  })

  const handleFinishOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert("Por favor, preencha seu nome e telefone")
      return
    }

    if (cart.length === 0) {
      alert("Seu carrinho está vazio")
      return
    }

    try {
      // Salvar pedido no banco
      const orderId = await submitOrder(customerInfo)

      // Preparar mensagem para WhatsApp
      const orderDetails = cart
        .map((item) => `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`)
        .join("\n")

      const total = getCartTotal()

      const message =
        `🍰 *PEDIDO OFUÊ* 🍰\n\n` +
        `📋 *Pedido:* #${orderId.slice(-8)}\n` +
        `👤 *Cliente:* ${customerInfo.name}\n` +
        `📱 *Telefone:* ${customerInfo.phone}\n` +
        `📍 *Endereço:* ${customerInfo.address || "Retirada no local"}\n\n` +
        `🛍️ *ITENS DO PEDIDO:*\n${orderDetails}\n\n` +
        `💰 *TOTAL: R$ ${total.toFixed(2)}*\n\n` +
        `📝 *Observações:* ${customerInfo.observations || "Nenhuma"}\n\n` +
        `✅ *Pedido salvo no sistema!*`

      // Enviar via WhatsApp
      const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")

      // Limpar formulário
      setCustomerInfo({
        name: "",
        phone: "",
        address: "",
        observations: "",
      })

      alert("Pedido finalizado com sucesso! Você será redirecionado para o WhatsApp.")
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error)
      alert("Erro ao finalizar pedido. Tente novamente.")
    }
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setActiveSubcategory("todos")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro ao carregar produtos: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo-ofue.png" alt="Ofuê" className="h-10" />
              <div className="hidden md:block text-sm text-gray-600">Doces que fazem a vida mais doce</div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-red-500 font-medium hover:text-red-600">
                Cardápio
              </a>
              <a href="#" className="text-red-500 font-medium hover:text-red-600">
                Novidades
              </a>
              <div className="relative group">
                <button className="text-red-500 font-medium hover:text-red-600 flex items-center">
                  Categorias
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
            </nav>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="relative border-red-500 text-red-500 hover:bg-red-50 bg-transparent"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Carrinho
                  {getCartItemsCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                      {getCartItemsCount()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Seu Carrinho</SheetTitle>
                  <SheetDescription>Revise seus itens antes de finalizar o pedido</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Seu carrinho está vazio</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)} cada</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Separator />

                      <div className="text-lg font-bold text-right">Total: R$ {getCartTotal().toFixed(2)}</div>

                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="name">Nome *</Label>
                          <Input
                            id="name"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Seu nome completo"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Telefone *</Label>
                          <Input
                            id="phone"
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="(11) 99999-9999"
                          />
                        </div>

                        <div>
                          <Label htmlFor="address">Endereço para entrega</Label>
                          <Input
                            id="address"
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                            placeholder="Rua, número, bairro"
                          />
                        </div>

                        <div>
                          <Label htmlFor="observations">Observações</Label>
                          <Textarea
                            id="observations"
                            value={customerInfo.observations}
                            onChange={(e) => setCustomerInfo((prev) => ({ ...prev, observations: e.target.value }))}
                            placeholder="Alguma observação especial?"
                            rows={3}
                          />
                        </div>

                        <Button
                          onClick={handleFinishOrder}
                          className="w-full bg-red-500 hover:bg-red-600 text-white"
                          disabled={cart.length === 0 || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Finalizando Pedido...
                            </>
                          ) : (
                            "Finalizar Pedido"
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Bem-vindo à Ofuê</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Doces artesanais feitos com amor e carinho</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              (11) 99999-9999
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              São Paulo, SP
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Seg-Sáb: 8h às 18h
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { key: "todos", label: "Todos os Produtos" },
              { key: "bolos", label: "Bolos" },
              { key: "doces", label: "Doces" },
              { key: "especiais", label: "Especiais" },
            ].map((category) => (
              <Button
                key={category.key}
                variant={activeCategory === category.key ? "default" : "outline"}
                onClick={() => handleCategoryChange(category.key)}
                className={
                  activeCategory === category.key
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "border-red-200 text-red-500 hover:bg-red-50"
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {activeCategory === "doces" && (
        <section className="py-4 bg-stone-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { key: "todos", label: "Todos os Doces" },
                { key: "brigadeiros", label: "Brigadeiros" },
                { key: "cookies", label: "Cookies" },
                { key: "outros", label: "Outros Doces" },
              ].map((subcategory) => (
                <Button
                  key={subcategory.key}
                  variant={activeSubcategory === subcategory.key ? "default" : "outline"}
                  onClick={() => setActiveSubcategory(subcategory.key)}
                  size="sm"
                  className={
                    activeSubcategory === subcategory.key
                      ? "bg-pink-500 hover:bg-pink-600 text-white"
                      : "border-pink-200 text-pink-600 hover:bg-pink-50"
                  }
                >
                  {subcategory.label}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.popular && <Badge className="absolute top-2 left-2 bg-red-500 text-white">Popular</Badge>}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-500">R$ {product.price.toFixed(2)}</span>
                    <Button onClick={() => addToCart(product)} className="bg-red-500 hover:bg-red-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/logo-ofue.png" alt="Ofuê" className="h-8 mb-4" />
              <p className="text-gray-300">
                Doces artesanais feitos com ingredientes selecionados e muito amor. Transformando momentos especiais em
                memórias ainda mais doces.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  (11) 99999-9999
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  São Paulo, SP
                </div>
                <div className="flex items-center">
                  <Instagram className="h-4 w-4 mr-2" />
                  @ofu.doces
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Horário de Funcionamento</h4>
              <div className="space-y-1 text-gray-300">
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 16h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="text-center text-gray-400">
            <p>&copy; 2025 Ofuê. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
