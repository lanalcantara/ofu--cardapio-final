"use client"

import { useState, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ShoppingCart, Plus, Minus, Phone, MapPin, Instagram, ChevronRight, Star, Heart, User, ShoppingBag, Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useProducts } from "@/hooks/useProducts"
import { useCart } from "@/hooks/useCart"

import { supabase } from "@/lib/supabase"
import { User as SupabaseUser } from "@supabase/supabase-js"

export default function Component() {
  const { products, loading } = useProducts()
  const { cart, addToCart, removeFromCart, getCartTotal, getCartItemsCount, submitOrder, isSubmitting } = useCart()

  const [activeCategory, setActiveCategory] = useState<string>("todos")
  const [user, setUser] = useState<SupabaseUser | null>(null)

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    observations: "",
    paymentMethod: "pix"
  })

  // Verificar Auth e carregar dados salvos
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Carregar dados salvos do cliente para o checkout
    const savedData = localStorage.getItem("ofu_customer_info")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setCustomerInfo(prev => ({ ...prev, ...parsed }))
      } catch (e) {
        console.error("Erro ao ler dados salvos", e)
      }
    }

    return () => subscription.unsubscribe()
  }, [])

  // Carrossel Principal (Hero) com Autoplay
  const [heroRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  // Carrossel de Populares
  const [popularRef, popularApi] = useEmblaCarousel({ align: "start", loop: false, dragFree: true })

  const scrollNext = () => popularApi?.scrollNext()

  const filteredProducts = products.filter((product) => {
    if (activeCategory === "todos") return true
    return product.category === activeCategory
  })

  const popularProducts = products.filter(p => p.popular).length > 0
    ? products.filter(p => p.popular)
    : products.slice(0, 6)

  const handleFinishOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Por favor, preencha os campos obrigatórios (Nome, Telefone, Endereço)")
      return
    }
    if (cart.length === 0) {
      alert("Seu carrinho está vazio")
      return
    }

    try {
      const fullObservations = `Pagamento: ${customerInfo.paymentMethod.toUpperCase()}\nObs: ${customerInfo.observations}`
      const orderId = await submitOrder({ ...customerInfo, observations: fullObservations })

      const orderDetails = cart
        .map((item) => `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`)
        .join("\n")

      const paymentLabel: Record<string, string> = { pix: "Pix", card: "Cartão", money: "Dinheiro" }
      const total = getCartTotal()

      const message = `🍰 *PEDIDO OFUÊ* 🍰\n\n` +
        `📋 *Pedido:* #${orderId.slice(-8)}\n` +
        `👤 *Cliente:* ${customerInfo.name}\n` +
        `📱 *Telefone:* ${customerInfo.phone}\n` +
        `📍 *Endereço:* ${customerInfo.address}\n\n` +
        `🛍️ *ITENS:*\n${orderDetails}\n\n` +
        `💰 *TOTAL: R$ ${total.toFixed(2)}*\n` +
        `💳 *Pagamento:* ${paymentLabel[customerInfo.paymentMethod]}\n\n` +
        `✅ *Pedido Enviado!*`

      window.open(`https://wa.me/558184065052?text=${encodeURIComponent(message)}`, "_blank")
      window.location.reload()
    } catch (error) {
      alert("Erro ao finalizar. Tente novamente.")
    }
  }

  // Gerar categorias dinamicamente com base nos produtos
  const categoriesInProducts = Array.from(new Set(products.map(p => p.category))).sort()

  const formatCategory = (cat: string) => {
    if (cat === "doces_simples") return "Docinhos"
    if (cat === "doces_especiais") return "Gourmet"
    return cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ")
  }

  const dynamicCategoryList = [
    { key: "todos", label: "Menu Completo" },
    ...categoriesInProducts.map(cat => ({
      key: cat,
      label: formatCategory(cat)
    }))
  ]

  // Imagens de banner (placeholder de alta qualidade para doceria)
  const heroSlides = [
    {
      id: 1,
      title: "Transforme sua festa",
      subtitle: "Bolos artesanais que encantam os olhos e o paladar",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2089&auto=format&fit=crop",
      cta: "Conhecer Bolos"
    },
    {
      id: 2,
      title: "Doces que abraçam",
      subtitle: "Aquele docinho especial para melhorar seu dia",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1974&auto=format&fit=crop",
      cta: "Pedir Agora"
    },
    {
      id: 3,
      title: "Novidades da Semana",
      subtitle: "Brownies recheados e cookies saindo do forno",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=2070&auto=format&fit=crop",
      cta: "Ver Novidades"
    }
  ]

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDF8F5] text-red-400">Carregando doçuras...</div>

  return (
    <div className="min-h-screen bg-[#ffc2d1] font-sans selection:bg-red-200">

      {/* Header com Logo de Canto e Fundo Rosa */}
      <header className="fixed top-0 w-full z-50 bg-[#ffc2d1]/95 backdrop-blur-sm border-b border-white/20 shadow-sm transition-all h-20">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">

          {/* Esquerda: LOGO */}
          <div className="flex items-center gap-4">
            <img src="/logo-ofue.png" alt="Ofuê Confeitaria Artesanal" className="h-14 md:h-16 object-contain" />
          </div>

          {/* Direita: Social + Carrinho */}
          <div className="flex items-center gap-4">
            <a href="https://instagram.com/ofuedoceria" target="_blank" className="hidden md:flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors font-bold">
              <Instagram className="h-5 w-5" />
              <span className="text-sm">@ofuedoceria</span>
            </a>

            {/* Menu de Usuário (Dinâmico) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white/50 hover:bg-white/80 text-red-600 border-none shadow-none rounded-full h-12 w-12 p-0 relative">
                  <User className="h-6 w-6" />
                  {user && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user ? `Olá, ${user.email?.split('@')[0]}` : "Minha Conta"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer w-full flex items-center">
                        Meus Dados
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer w-full flex items-center">
                        Meus Pedidos (WhatsApp)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={async () => {
                        await supabase.auth.signOut()
                        setUser(null)
                        window.location.reload()
                      }}
                    >
                      Sair
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer w-full flex items-center">
                      Entrar / Cadastrar
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button className="relative bg-white/50 hover:bg-white/80 text-red-600 border-none shadow-none rounded-full h-12 w-12 p-0">
                  <div className="relative">
                    <ShoppingCart className="h-6 w-6" />
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center animate-bounce">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col border-l-red-100">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="text-2xl font-serif text-red-500">Sua Sacola</SheetTitle>
                  <SheetDescription>Tudo pronto para deixar a vida mais doce?</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                      <ShoppingCart className="h-16 w-16 mb-4" />
                      <p>Sua sacola está vazia</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            <img src={item.image_url || "/placeholder.svg"} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                            <p className="text-red-500 font-bold">R$ {item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-red-50 rounded-full px-2 py-1">
                            <button onClick={() => removeFromCart(item.id)}><Minus className="h-3 w-3 text-red-600" /></button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button onClick={() => addToCart(item)}><Plus className="h-3 w-3 text-red-600" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t pt-6 space-y-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>R$ {getCartTotal().toFixed(2)}</span>
                    </div>

                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg text-sm">
                      <Input placeholder="Seu Nome" value={customerInfo.name} onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="bg-white" />
                      <Input placeholder="Seu Telefone" value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="bg-white" />
                      <Input placeholder="Endereço de Entrega" value={customerInfo.address} onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })} className="bg-white" />

                      <RadioGroup value={customerInfo.paymentMethod} onValueChange={v => setCustomerInfo({ ...customerInfo, paymentMethod: v })} className="flex gap-2 text-xs">
                        <div className="flex items-center space-x-1"><RadioGroupItem value="pix" id="pix" /><Label htmlFor="pix">Pix</Label></div>
                        <div className="flex items-center space-x-1"><RadioGroupItem value="card" id="card" /><Label htmlFor="card">Cartão</Label></div>
                        <div className="flex items-center space-x-1"><RadioGroupItem value="money" id="money" /><Label htmlFor="money">Dinheiro</Label></div>
                      </RadioGroup>

                      <Textarea
                        placeholder="Observações (ex: retirar cebola, troco para 50...)"
                        value={customerInfo.observations}
                        onChange={e => setCustomerInfo({ ...customerInfo, observations: e.target.value })}
                        className="bg-white h-20"
                      />
                    </div>

                    <Button onClick={handleFinishOrder} className="w-full bg-red-500 hover:bg-red-600 h-12 text-lg rounded-xl" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando..." : "Finalizar Pedido no WhatsApp"}
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* HERO CAROUSEL */}
        <section className="relative w-full overflow-hidden mb-12" ref={heroRef}>
          <div className="flex">
            {heroSlides.map((slide) => (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative h-[50vh] md:h-[60vh]">
                <div className="absolute inset-0 bg-black/30 z-10" />
                <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white space-y-4">
                  <Badge className="bg-red-500 hover:bg-red-600 text-white border-none px-4 py-1 text-sm uppercase tracking-widest">Ofuê Doceria</Badge>
                  <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight max-w-3xl">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 max-w-xl font-light">
                    {slide.subtitle}
                  </p>
                  <Button className="mt-6 bg-white text-red-500 hover:bg-gray-100 rounded-full px-8 h-12 text-base font-bold transition-transform hover:scale-105">
                    {slide.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MAIS VENDIDOS (Carousel) */}
        {popularProducts.length > 0 && (
          <section className="container mx-auto px-4 mb-16">
            <div className="flex items-end justify-between mb-8 px-2">
              <div>
                <h2 className="text-3xl font-serif font-bold text-gray-800">Favoritos da Casa</h2>
                <p className="text-gray-500 mt-1">Os queridinhos que todo mundo ama</p>
              </div>
            </div>

            <div className="relative group">
              <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={popularRef}>
                <div className="flex gap-6 pl-2 pb-8">
                  {popularProducts.map((product) => (
                    <div key={product.id} className="flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0 transform transition-all hover:-translate-y-2">
                      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden rounded-2xl h-full flex flex-col group cursor-pointer bg-white">
                        <div className="relative aspect-[4/5] overflow-hidden">
                          <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm text-red-500">
                            <Heart className="h-4 w-4 fill-current" />
                          </div>
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-16 translate-y-full group-hover:translate-y-0 transition-transform">
                            <Button onClick={(e) => { e.stopPropagation(); addToCart(product) }} className="w-full bg-white text-black hover:bg-gray-100 rounded-full font-bold">
                              Adicionar à Sacola
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col">
                          <div className="mb-2">
                            <Badge variant="secondary" className="bg-red-50 text-red-500 mb-2 text-[10px] uppercase font-bold tracking-wider">{product.category}</Badge>
                            <h3 className="font-bold text-lg text-gray-800 leading-tight mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2 font-light">{product.description}</p>
                          </div>
                          <div className="mt-auto pt-4 flex items-end justify-between">
                            <span className="text-xl font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
                            <Button size="icon" onClick={() => addToCart(product)} className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white md:hidden">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seta de Navegação */}
              <button
                onClick={scrollNext}
                className="absolute right-0 top-[40%] z-20 bg-white/90 hover:bg-white text-red-500 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 -mr-2 md:-mr-4 border border-red-100 hidden md:flex"
                aria-label="Ver mais"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </section>
        )}

        {/* MENU DE CATEGORIAS */}
        <section className="container mx-auto px-4 mb-8 sticky top-20 z-30">
          <div className="bg-white/80 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-2">
            <div className="flex gap-2 overflow-x-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {dynamicCategoryList.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`
                                px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                                ${activeCategory === cat.key
                      ? "bg-red-500 text-white shadow-lg scale-100"
                      : "bg-transparent text-gray-500 hover:bg-red-50 hover:text-red-500"
                    }
                            `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LISTA COMPLETA DE PRODUTOS */}
        <section className="container mx-auto px-4 pb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-gray-800">
              {activeCategory === "todos" ? "Nosso Cardápio Completo" : dynamicCategoryList.find(c => c.key === activeCategory)?.label}
            </h2>
            <Separator className="w-16 mx-auto mt-4 bg-red-300 h-1 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4 relative shadow-sm">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                  {/* Botão flutuante de adicionar */}
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-3 right-3 bg-white text-gray-900 p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                    <span className="font-bold text-red-500">R$ {product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 opacity-50">
              <p>Nenhuma delícia encontrada nesta categoria ainda.</p>
            </div>
          )}
        </section>
      </main>

      {/* SEÇÃO QUEM SOMOS */}
      {/* SEÇÃO QUEM SOMOS */}
      <section className="bg-[#FFE4E1] py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="bg-white text-[#FF8C00] mb-6 px-4 py-1 text-xs uppercase tracking-[0.2em] font-bold shadow-sm font-fredoka">Nossa História</Badge>
            <h2 className="text-4xl md:text-5xl font-fredoka text-[#FF8C00] mb-8">Quem Somos?</h2>

            <div className="prose prose-lg mx-auto text-[#8B0000] leading-relaxed font-medium bg-white/80 p-8 rounded-3xl backdrop-blur-sm shadow-sm font-quicksand">
              <p className="mb-4">
                "Oiii, prazer! Me chamo <strong className="text-[#FF8C00]">Isabella</strong>, tenho 31 anos e sou a dona da Ofuê Doceria."
              </p>
              <p className="mb-4">
                Comecei fazendo trufas há uns 12 anos atrás e de lá pra cá, nunca mais deixei de fazer os doces. Porém sempre trabalhei e os doces eram só algo extra, até eu entender que era realmente o que eu amava fazer.
              </p>
              <p>
                Em 2021 me juntei com mais 2 amigas e aí a Ofuê nasceu! Nos separamos, continuei sozinha, larguei a CLT e hoje eu sou e vivo a Ofuê até alcançarmos nossos objetivos &lt;3
              </p>
            </div>
          </div>
        </div>

        {/* Elemento decorativo de corações (simulado com bolas por enquanto) */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFB6C1] rounded-full mix-blend-multiply filter blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFDAB9] rounded-full mix-blend-multiply filter blur-3xl opacity-40 translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* SEÇÃO INFORMAÇÕES IMPORTANTES */}
      {/* SEÇÃO INFORMAÇÕES IMPORTANTES */}
      <section className="py-20 bg-[#FFF5EE]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-fredoka text-[#FF8C00]">Avisos Importantes</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Sobre o Pedido */}
            <div className="bg-[#FFE4E1] p-8 rounded-3xl border-2 border-[#FFB6C1] shadow-lg hover:rotate-1 transition-transform duration-300">
              <h3 className="text-xl font-fredoka text-[#FF8C00] mb-4 flex items-center gap-2">
                <ShoppingBag className="h-6 w-6" /> Sobre o Pedido
              </h3>
              <ul className="space-y-3 text-sm text-[#8B0000] font-quicksand font-bold">
                <li>• Peça pelo nosso WhatsApp.</li>
                <li>• <span className="underline decoration-[#FF8C00] decoration-2">5 dias de antecedência</span>.</li>
                <li>• Sinal de 50% para confirmar.</li>
                <li>• Cancelamento em até 2 dias.</li>
              </ul>
            </div>

            {/* Horário */}
            <div className="bg-[#FFE4E1] p-8 rounded-3xl border-2 border-[#FFB6C1] shadow-lg hover:-rotate-1 transition-transform duration-300">
              <h3 className="text-xl font-fredoka text-[#FF8C00] mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6" /> Horário
              </h3>
              <ul className="space-y-3 text-sm text-[#8B0000] font-quicksand font-bold">
                <li>• <strong>Seg - Sex:</strong> 08h às 18h</li>
                <li>• <strong>Sábados:</strong> 09h às 15h</li>
                <li>• Domingo não funcionamos.</li>
              </ul>
            </div>

            {/* Pagamento */}
            <div className="bg-[#FFE4E1] p-8 rounded-3xl border-2 border-[#FFB6C1] shadow-lg hover:rotate-1 transition-transform duration-300">
              <h3 className="text-xl font-fredoka text-[#FF8C00] mb-4 flex items-center gap-2">
                <CreditCard className="h-6 w-6" /> Pagamento
              </h3>
              <ul className="space-y-3 text-sm text-[#8B0000] font-quicksand font-bold">
                <li>• Cartão Crédito/Débito (+5%).</li>
                <li>• Pix.</li>
                <li>• Dinheiro.</li>
              </ul>
            </div>

            {/* Entrega */}
            <div className="bg-[#FFE4E1] p-8 rounded-3xl border-2 border-[#FFB6C1] shadow-lg hover:-rotate-1 transition-transform duration-300">
              <h3 className="text-xl font-fredoka text-[#FF8C00] mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6" /> Retirada
              </h3>
              <ul className="space-y-3 text-sm text-[#8B0000] font-quicksand font-bold">
                <li>• Não fazemos entrega própria.</li>
                <li>• Pode chamar Uber Flash.</li>
                <li>• Retirada na nossa loja.</li>
                <li>Rua Professor Alexandre Borges, 5676.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Institucional */}
      <footer className="bg-white border-t border-red-50 py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 text-center md:text-left">

          {/* Marca */}
          <div className="flex flex-col items-center md:items-start">
            <img src="/logo-ofue.png" alt="Ofuê" className="h-16 mb-4 opacity-80 grayscale hover:grayscale-0 transition-all" />
            <p className="text-[#8B0000] text-sm max-w-xs leading-relaxed font-quicksand font-medium">
              Sua Doceria preferida 💖
              <br />
              Brigadeiros, bolos e cupcakes personalizados pra abrilhantar a sua festa 🥳
            </p>
          </div>

          {/* Contato (Simplificado) */}
          <div>
            <h4 className="font-fredoka text-[#FF8C00] text-lg mb-4 tracking-wide">Fale Conosco</h4>
            <ul className="space-y-3 text-[#8B0000] text-sm font-quicksand font-bold">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="h-4 w-4" /> (81) 8406-5052
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-lg">@</span> ofuedoceria@gmail.com
              </li>
            </ul>
          </div>

          {/* Onde Encontrar (iFood e Insta) */}
          <div>
            <h4 className="font-fredoka text-[#FF8C00] text-lg mb-4 tracking-wide">Estamos Online</h4>
            <div className="flex flex-col gap-4 items-center md:items-start">

              <a href="#" className="flex items-center gap-3 text-[#8B0000] hover:text-[#d32f2f] transition-colors font-quicksand font-bold group">
                <div className="bg-[#EA1D2C] text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <ShoppingBag className="h-5 w-5 fill-current" />
                </div>
                <span>Peça pelo <strong>iFood</strong></span>
              </a>

              <a href="https://instagram.com/ofuedoceria" target="_blank" className="flex items-center gap-3 text-[#8B0000] hover:text-[#E1306C] transition-colors font-quicksand font-bold group">
                <div className="bg-pink-100 text-[#E1306C] p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <Instagram className="h-5 w-5" />
                </div>
                <span>Siga <strong>@ofuedoceria</strong></span>
              </a>

            </div>
          </div>

        </div>

        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-red-50 text-center text-red-300 text-xs font-quicksand">
          <p>© {new Date().getFullYear()} Ofuê Doceria. Feito com muito amor e açúcar.</p>
        </div>
      </footer>
    </div>
  )
}
