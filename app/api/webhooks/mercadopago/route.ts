
import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PrismaClient } from "@prisma/client"
import { fulfillOrder } from "@/lib/order-service"

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });
const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { type, data, topic, id } = body

        // Handle both 'type' (new format) and 'topic' (old format)
        const eventType = type || topic;
        const dataId = data?.id || id;

        console.log(`Webhook received: Type=${eventType}, ID=${dataId}`);

        if (eventType === 'payment') {
            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: dataId });

            if (paymentInfo) {
                const orderId = Number(paymentInfo.external_reference);
                const status = paymentInfo.status;
                const paymentId = paymentInfo.id?.toString();

                console.log(`Payment Info: ID=${paymentId}, Order=${orderId}, Status=${status}`);

                if (orderId && !isNaN(orderId)) {
                    // Update Order
                    const dbStatus = status === 'approved' ? 'PAID' : 'PENDING';

                    const order = await prisma.order.update({
                        where: { id: orderId },
                        data: {
                            status: dbStatus,
                            paymentId: paymentId,
                            updatedAt: new Date()
                        }
                    });

                    console.log(`Order #${orderId} updated to ${dbStatus}`);

                    if (dbStatus === 'PAID') {
                        await fulfillOrder(orderId);
                    }
                }
            }
        } else if (eventType === 'merchant_order') {
            // Some flows (like Checkout Pro sometimes) trigger merchant_order updates
            // We can fetch the merchant order to see associated payments
            // For now, logging it is enough, as 'payment' event usually follows or accompanies it.
            console.log("Merchant Order event received (skipped for now, relying on payment event)");
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Webhook Error:", error)
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
    }
}
