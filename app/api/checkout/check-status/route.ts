import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PrismaClient } from "@prisma/client"
import { fulfillOrder } from "@/lib/order-service"

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });
const prisma = new PrismaClient()

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const paymentId = searchParams.get('paymentId')
        const orderId = searchParams.get('orderId')

        if (!paymentId && !orderId) {
            return NextResponse.json({ error: "paymentId or orderId required" }, { status: 400 })
        }

        // If we have a paymentId, check directly with Mercado Pago
        if (paymentId) {
            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: Number(paymentId) });

            if (paymentInfo) {
                const mpStatus = paymentInfo.status; // 'approved', 'pending', 'rejected', etc.
                const mpOrderId = Number(paymentInfo.external_reference);

                console.log(`[Check-Status] MP Payment ${paymentId}: status=${mpStatus}, order=${mpOrderId}`);

                // If approved, update our DB too (in case webhook missed it)
                if (mpStatus === 'approved' && mpOrderId && !isNaN(mpOrderId)) {
                    const currentOrder = await prisma.order.findUnique({ where: { id: mpOrderId } });

                    if (currentOrder && currentOrder.status !== 'PAID' && currentOrder.status !== 'COMPLETED') {
                        await prisma.order.update({
                            where: { id: mpOrderId },
                            data: {
                                status: 'PAID',
                                paymentId: paymentInfo.id?.toString(),
                                updatedAt: new Date()
                            }
                        });
                        console.log(`[Check-Status] Order #${mpOrderId} -> PAID (via polling)`);
                        await fulfillOrder(mpOrderId);
                    }
                }

                return NextResponse.json({
                    status: mpStatus === 'approved' ? 'PAID' : mpStatus === 'rejected' ? 'REJECTED' : 'PENDING',
                    mpStatus: mpStatus
                })
            }
        }

        // Fallback: check by orderId in our DB
        if (orderId) {
            const order = await prisma.order.findUnique({ where: { id: Number(orderId) } });
            if (order) {
                return NextResponse.json({ status: order.status })
            }
        }

        return NextResponse.json({ status: 'PENDING' })

    } catch (error) {
        console.error("[Check-Status] Error:", error)
        return NextResponse.json({ status: 'PENDING' }) // Don't error out, just keep polling
    }
}
