import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // 1. Admin Authentication
    if (path.startsWith('/admin')) {
        // Public admin routes (login)
        if (path === '/admin/login') {
            // If already logged in, redirect to dashboard
            const adminSession = request.cookies.get('admin_session')
            if (adminSession?.value === process.env.ADMIN_SECRET) {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
            return NextResponse.next()
        }

        // Check for cookie on protected routes
        const adminSession = request.cookies.get('admin_session')

        // Simple check: cookie value must equal the env secret
        // Note: ensure ADMIN_SECRET is set in .env
        if (!adminSession || adminSession.value !== process.env.ADMIN_SECRET) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
}
