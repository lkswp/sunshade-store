
import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment, MerchantOrder } from 'mercadopago';
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
            const mo = new MerchantOrder(client);
            const orderInfo = await mo.get({ merchantOrderId: dataId });

            if (orderInfo) {
                const orderId = Number(orderInfo.external_reference);
                const paidAmount = orderInfo.payments?.reduce((acc, p) => p.status === 'approved' ? acc + (p.transaction_amount || 0) : acc, 0) || 0;
                const totalAmount = orderInfo.total_amount || 0;

                console.log(`Merchant Order: ID=${dataId}, InternalOrder=${orderId}, Paid=${paidAmount}/${totalAmount}`);

                if (orderId && !isNaN(orderId) && paidAmount >= totalAmount && totalAmount > 0) {
                    // Check if already paid to avoid redundant updates
                    const currentOrder = await prisma.order.findUnique({ where: { id: orderId } });
                    if (currentOrder && currentOrder.status !== 'PAID' && currentOrder.status !== 'COMPLETED') {
                        await prisma.order.update({
                            where: { id: orderId },
                            data: {
                                status: 'PAID',
                                updatedAt: new Date()
                            }
                        });
                        console.log(`Order #${orderId} set to PAID via MerchantOrder`);
                        await fulfillOrder(orderId);
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
