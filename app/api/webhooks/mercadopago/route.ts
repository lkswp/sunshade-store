
import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PrismaClient } from "@prisma/client"
import { fulfillOrder } from "@/lib/order-service"

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });
const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { type, data } = body

        if (type === 'payment') {
            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: data.id });

            if (paymentInfo.status === 'approved') {
                // Find order by payment ID
                const order = await prisma.order.findFirst({
                    where: { paymentId: data.id.toString() }
                })

                if (order && order.status !== 'PAID') { // Changed PAID to check logic
                    // Update status
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { status: 'PAID' } // Use PAID as agreed
                    })

                    // Fulfill Order (Send Commands)
                    await fulfillOrder(order.id)
                }
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Webhook Error:", error)
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
    }
}
