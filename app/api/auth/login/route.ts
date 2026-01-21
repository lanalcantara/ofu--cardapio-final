import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        const correctEmail = "ofuedoceria@gmail.com"
        const correctPassword = process.env.ADMIN_PASSWORD

        // Verifica Email E Senha
        const cleanEmail = email?.trim().toLowerCase()
        const cleanPassword = password?.trim()

        if (cleanEmail === correctEmail && cleanPassword && cleanPassword === correctPassword) {
            const response = NextResponse.json({ success: true })

            // Setar cookie HTTP-only
            response.cookies.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 // 1 dia
            })

            return response
        }

        return NextResponse.json({ success: false, message: 'Senha incorreta' }, { status: 401 })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 })
    }
}
