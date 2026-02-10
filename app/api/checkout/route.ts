
import { NextResponse } from "next/server"
import { PRODUCTS_DATA } from "@/lib/products"
import { PrismaClient } from "@prisma/client"
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Initialize Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });

// Initialize Prisma
const prisma = new PrismaClient()

export async function POST(request: Request) {
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
        console.error("Missing MERCADO_PAGO_ACCESS_TOKEN");
        return NextResponse.json({ error: "Server Configuration Error: Missing Payment Token" }, { status: 500 });
    }

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

        // 2. Create Order PENDING in Database
        let user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) {
            user = await prisma.user.create({
                data: { username }
            })
        }

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                total: total,
                status: "PENDING",
                paymentMethod: body.paymentMethod === 'PIX' ? 'PIX' : 'CHECKOUT_PRO',
                items: validItems
            }
        })

        // Determine Base URL for callbacks
        const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        // 3. Handle Payment based on Method
        if (body.paymentMethod === 'PIX') {
            // --- DIRECT PIX ---
            const payment = new Payment(client);
            const paymentData = await payment.create({
                body: {
                    transaction_amount: total,
                    description: "Sunshade Store",
                    payment_method_id: 'pix',
                    external_reference: order.id.toString(),
                    payer: {
                        email: "test_user@test.com" // In production, collect valid email
                    },
                    notification_url: `${origin}/api/webhooks/mercadopago` // Webhook URL
                }
            });

            if (!paymentData || !paymentData.point_of_interaction) {
                throw new Error("Failed to generate PIX QR Code");
            }

            const pixData = {
                qrCode: paymentData.point_of_interaction.transaction_data?.qr_code,
                qrCodeBase64: paymentData.point_of_interaction.transaction_data?.qr_code_base64,
                ticketUrl: paymentData.point_of_interaction.transaction_data?.ticket_url,
                paymentId: paymentData.id
            }

            return NextResponse.json({
                success: true,
                orderId: order.id,
                pixData: pixData
            })

        } else {
            // --- CHECKOUT PRO (REDIRECT) ---
            const preference = new Preference(client);

            const preferenceData = await preference.create({
                body: {
                    items: validItems.map(item => ({
                        id: item.product.id,
                        title: item.product.name,
                        quantity: item.quantity,
                        unit_price: item.product.price,
                        currency_id: 'BRL',
                        category_id: 'virtual_goods'
                    })),
                    payer: {
                        email: "test_user@test.com"
                    },
                    external_reference: order.id.toString(),
                    back_urls: {
                        success: `${origin}/checkout/success`,
                        failure: `${origin}/checkout?status=failure`,
                        pending: `${origin}/checkout?status=pending`
                    },
                    auto_return: "approved",
                    binary_mode: true,
                    statement_descriptor: "SUNSHADE STORE"
                }
            });

            if (!preferenceData || !preferenceData.init_point) {
                throw new Error("Failed to create preference with Mercado Pago");
            }

            return NextResponse.json({
                success: true,
                orderId: order.id,
                url: preferenceData.init_point // Redirect URL
            })
        }

    } catch (error) {
        console.error("Checkout Error Details:", error)
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
