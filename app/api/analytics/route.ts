import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        // Simple tracking
        const headersList = await headers()
        const forwardedFor = headersList.get('x-forwarded-for')
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'
        const userAgent = headersList.get('user-agent')

        // Basic hash for IP (privacy)
        // For now storing raw IP or "unknown", in production use hash
        const ipHash = ip // In real app, hash this

        // Create visit
        // Note: To avoid spam, we might check if IP visited recently but let's keep it simple: Raw hits
        await prisma.visit.create({
            data: {
                path: '/', // We could pass path in body
                ipHash: ipHash,
                userAgent: userAgent || 'unknown'
            }
        })

        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
