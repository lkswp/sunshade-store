
import { NextResponse } from "next/server"
import { PRODUCTS_DATA } from "@/lib/products"
import { PrismaClient } from "@prisma/client"
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Initialize Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });

// Initialize Prisma
const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { items, username } = body

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
        }
        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 })
        }

        // 1. Calculate Total & Validate Items from DB
        const itemIds = items.map((i: any) => i.id)
        const dbProducts = await prisma.product.findMany({
            where: {
                id: { in: itemIds },
                active: true
            }
        })

        let total = 0
        const validItems: { product: typeof dbProducts[0], quantity: number }[] = []

        for (const item of items) {
            const product = dbProducts.find(p => p.id === item.id)
            if (product) {
                const quantity = item.quantity || 1
                total += product.price * quantity
                validItems.push({ product, quantity })
            }
        }

        if (validItems.length === 0) {
            return NextResponse.json({ error: "No valid items found" }, { status: 400 })
        }

        // 2. Mercado Pago Payment
        const payment = new Payment(client);

        // Helper to get product names
        const description = validItems.map(i => `${i.quantity}x ${i.product.name}`).join(', ').substring(0, 200);

        const paymentData = await payment.create({
            body: {
                transaction_amount: total,
                description: description,
                payment_method_id: 'pix',
                payer: {
                    email: 'buyer@test.com'
                }
            }
        });

        if (!paymentData || !paymentData.id) {
            throw new Error("Failed to create payment with Mercado Pago");
        }

        // 3. Database Operations (Transaction)
        const result = await prisma.$transaction(async (tx: any) => {
            // Find or Create User
            let user = await tx.user.findUnique({
                where: { username }
            })

            if (!user) {
                user = await tx.user.create({
                    data: { username }
                })
            }

            // Create Order PENDING
            const order = await tx.order.create({
                data: {
                    userId: user.id,
                    total: total,
                    status: "PENDING",
                    paymentMethod: "PIX",
                    paymentId: paymentData.id!.toString(),
                    ticketUrl: paymentData.point_of_interaction?.transaction_data?.qr_code,
                    items: validItems // Save items for later fulfillment
                }
            })

            return order
        })

        return NextResponse.json({
            success: true,
            orderId: result.id,
            qrCode: paymentData.point_of_interaction?.transaction_data?.qr_code,
            qrCodeBase64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64
        })

    } catch (error) {
        console.error("Checkout Error:", error)
        return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
    }
}
