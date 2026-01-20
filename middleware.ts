import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Se estiver tentando acessar rotas de admin
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Ignorar a própria página de login para evitar loop infinito
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next()
        }

        // Verificar se o cookie de autenticação existe
        const authCookie = request.cookies.get('admin_session')

        // Se não tiver cookie, redireciona para login
        if (!authCookie || authCookie.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
