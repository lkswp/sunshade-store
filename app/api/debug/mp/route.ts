import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from 'mercadopago';

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
        if (!token) return NextResponse.json({ error: "Missing Token" });

        const client = new MercadoPagoConfig({ accessToken: token });
        const preference = new Preference(client);

        const body = {
            items: [
                {
                    id: "TEST-ITEM",
                    title: "Test Item Debug",
                    quantity: 1,
                    unit_price: 1.00,
                    currency_id: 'BRL',
                    category_id: 'virtual_goods'
                }
            ],
            // notification_url: "https://your-site.com/...", // Omitted for simple test
            back_urls: {
                success: "https://www.google.com/success", // Must be valid URL for auto_return
                failure: "https://www.google.com/failure",
                pending: "https://www.google.com/pending"
            },
            auto_return: "approved" as const,
        };

        const response = await preference.create({ body });

        return NextResponse.json({
            message: "Preference Created Successfully",
            token_prefix: token.substring(0, 10) + "...",
            is_test_token: token.startsWith("TEST-"),
            response: response
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            error: "Failed to create preference",
            details: error.message || error,
            stack: error.stack
        }, { status: 500 });
    }
}
