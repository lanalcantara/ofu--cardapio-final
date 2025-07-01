import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerInfo, cartItems, total } = body

    // Criar o pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        observations: customerInfo.observations,
        total_amount: total,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Criar os itens do pedido
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Pedido criado com sucesso!",
    })
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return NextResponse.json({ success: false, message: "Erro ao processar pedido" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar pedidos" }, { status: 500 })
  }
}
