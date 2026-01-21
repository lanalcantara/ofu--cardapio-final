import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        // Preparar objeto de atualização (remover campos undefined)
        const updates: any = {}
        if (body.name !== undefined) updates.name = body.name
        if (body.description !== undefined) updates.description = body.description
        if (body.price !== undefined) updates.price = parseFloat(body.price)
        if (body.category !== undefined) updates.category = body.category
        if (body.subcategory !== undefined) updates.subcategory = body.subcategory
        if (body.image_url !== undefined) updates.image_url = body.image_url
        if (body.popular !== undefined) updates.popular = body.popular

        // Se não houver atualizações, retornar erro
        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { success: false, message: "Nenhum dado para atualizar" },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from("products")
            .update(updates)
            .eq("id", id)
            .select()
            .single()

        if (error) {
            throw error
        }

        return NextResponse.json({ success: true, product: data })
    } catch (error) {
        console.error("Erro ao atualizar produto:", error)
        return NextResponse.json(
            { success: false, message: "Erro ao atualizar produto" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Soft delete (apenas desativar)
        const { error } = await supabase
            .from("products")
            .update({ active: false })
            .eq("id", id)

        if (error) {
            throw error
        }

        return NextResponse.json({ success: true, message: "Produto removido com sucesso" })
    } catch (error) {
        console.error("Erro ao remover produto:", error)
        return NextResponse.json(
            { success: false, message: "Erro ao remover produto" },
            { status: 500 }
        )
    }
}
