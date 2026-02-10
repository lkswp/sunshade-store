
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

            if (paymentInfo) {
                const orderId = Number(paymentInfo.external_reference);
                const status = paymentInfo.status;
                const paymentId = paymentInfo.id?.toString();

                console.log(`Webhook: Processing Payment ${paymentId} for Order #${orderId}. Status: ${status}`);

                if (orderId && !isNaN(orderId)) {
                    // Update Order
                    const dbStatus = status === 'approved' ? 'PAID' : 'PENDING'; // Map MP status to DB status

                    const order = await prisma.order.update({
                        where: { id: orderId },
                        data: {
                            status: dbStatus,
                            paymentId: paymentId,
                            updatedAt: new Date()
                        }
                    });

                    if (dbStatus === 'PAID') {
                        // Fulfill Order (Send Commands) if not already fulfilled?
                        // Ideally we check if it was already processed, but updateAt helps ensuring.
                        // Command creation is idempotent-ish if we check existing?
                        // fulfilling order function should handle idempotency or we check status transition.
                        // For now simplified:
                        await fulfillOrder(order.id);
                    }
                }
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Webhook Error:", error)
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
    }
}
