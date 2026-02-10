import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const code = searchParams.get('code')

        if (!code) {
            return NextResponse.json({ error: "Code required" }, { status: 400 })
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        })

        if (!coupon) {
            return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 })
        }

        if (!coupon.active) {
            return NextResponse.json({ error: "Cupom inativo" }, { status: 400 })
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return NextResponse.json({ error: "Cupom expirado" }, { status: 400 })
        }

        if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
            return NextResponse.json({ error: "Limite de uso atingido" }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            discount: coupon.discount,
            code: coupon.code
        })

    } catch (error) {
        console.error("Coupon Validate Error:", error)
        return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 })
    }
}
