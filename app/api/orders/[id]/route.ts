import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status } = body

    const { data, error } = await supabase.from("orders").update({ status }).eq("id", params.id).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      order: data,
      message: "Status atualizado com sucesso!",
    })
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error)
    return NextResponse.json({ success: false, message: "Erro ao atualizar pedido" }, { status: 500 })
  }
}
