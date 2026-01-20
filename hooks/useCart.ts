"use client"

import { useState } from "react"

// Atualizar interface Product para incluir cookies
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  popular: boolean
  active: boolean
}

interface CartItem extends Product {
  quantity: number
}

interface CustomerInfo {
  name: string
  phone: string
  address: string
  observations: string
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId)
      if (existing && existing.quantity > 1) {
        return prev.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
      }
      return prev.filter((item) => item.id !== productId)
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const submitOrder = async (customerInfo: CustomerInfo) => {
    if (!customerInfo.name || !customerInfo.phone) {
      throw new Error("Nome e telefone são obrigatórios")
    }

    if (cart.length === 0) {
      throw new Error("Carrinho está vazio")
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerInfo,
          cartItems: cart,
          total: getCartTotal(),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      // Limpar carrinho após sucesso
      clearCart()

      return data.orderId
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    submitOrder,
    isSubmitting,
  }
}
