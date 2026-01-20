import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        hasEnv: !!process.env.ADMIN_PASSWORD,
        envValueLen: process.env.ADMIN_PASSWORD?.length,
        envValuePreview: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.substring(0, 3) + '...' : 'N/A'
    })
}
