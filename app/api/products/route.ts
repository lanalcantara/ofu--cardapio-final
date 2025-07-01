import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Atualizar para usar image_url do banco de dados
export async function GET() {
  try {
    const { data: products, error } = await supabase.from("products").select("*").eq("active", true).order("name")

    if (error) {
      throw error
    }

    // Mapear image_url para image para compatibilidade
    const productsWithImages = products.map((product) => ({
      ...product,
      image: product.image_url || "/placeholder.svg?height=300&width=300",
    }))

    return NextResponse.json({ success: true, products: productsWithImages })
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar produtos" }, { status: 500 })
  }
}
