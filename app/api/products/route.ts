
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all active products
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { active: true },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// Helper to strip Minecraft color codes
function stripColors(text: string): string {
    return text.replace(/§[0-9a-fk-or]/g, '');
}

// POST: Sync product from plugin
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        if (token !== process.env.PLUGIN_SECRET) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { id, name, description, price, category, image, commands, active, previewItems } = body;

        // Basic validation
        if (!id || !name || !price || !category || !commands) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const cleanName = stripColors(name);
        const cleanDescription = stripColors(description);

        const product = await prisma.product.upsert({
            where: { id },
            update: {
                name: cleanName,
                description: cleanDescription,
                price,
                category,
                image,
                commands,
                previewItems: previewItems || undefined,
                active: active !== undefined ? active : true,
            },
            create: {
                id,
                name: cleanName,
                description: cleanDescription,
                price,
                category,
                image,
                commands,
                previewItems: previewItems || undefined,
                active: active !== undefined ? active : true,
            },
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Error syncing product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
