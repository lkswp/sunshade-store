
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Validation helper
const validateSecret = (req: Request) => {
    const authHeader = req.headers.get('Authorization')
    return authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] === process.env.PLUGIN_SECRET
}

// GET: Fetch pending commands for a specific server (or all if not specified)
export async function GET(req: Request) {
    if (!validateSecret(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const server = searchParams.get('server') // 'survival', 'anarchy', etc.

        const where: any = { status: 'PENDING' }
        if (server) {
            where.serverScope = { in: ['global', server] }
        }

        const commands = await prisma.commandQueue.findMany({
            where,
            orderBy: { createdAt: 'asc' },
            take: 50 // Limit to prevent overload
        })

        return NextResponse.json(commands)
    } catch (error) {
        console.error("Error fetching commands:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// POST: Mark commands as PROCESSED or FAILED
export async function POST(req: Request) {
    if (!validateSecret(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { commandIds, status } = body

        if (!commandIds || !Array.isArray(commandIds) || commandIds.length === 0) {
            return NextResponse.json({ error: "Invalid commandIds" }, { status: 400 })
        }

        if (!['PROCESSED', 'FAILED'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 })
        }

        await prisma.commandQueue.updateMany({
            where: { id: { in: commandIds } },
            data: { status }
        })

        return NextResponse.json({ success: true, count: commandIds.length })

    } catch (error) {
        console.error("Error updating commands:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
