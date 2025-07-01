"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/supabase"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()

        if (data.success) {
          setProducts(data.products)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Erro ao carregar produtos")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}
