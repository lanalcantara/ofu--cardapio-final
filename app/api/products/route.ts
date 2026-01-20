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

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar dados básicos
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, message: "Nome, preço e categoria são obrigatórios" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{
        name: body.name,
        description: body.description || "",
        price: parseFloat(body.price),
        category: body.category,
        subcategory: body.subcategory || null,
        image_url: body.image_url || null,
        popular: body.popular || false,
        active: true
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, product: data })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao criar produto" },
      { status: 500 }
    )
  }
}
