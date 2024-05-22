import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(request: NextRequest,) {
    try {
        const body = await request.json();
        const { dynamicUserId, netWorth } = body;

        if (!dynamicUserId) {
            return new NextResponse(JSON.stringify({ error: 'dynamicUserId is required' }), { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { dynamicUserId },
            include: {
                scores: true,
            },
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        // Update the multiplier value
        const updatedScores = await prisma.userScores.update({
            where: { userId: dynamicUserId },
            data: { netWorth },
        });

        return NextResponse.json(updatedScores);
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: 'An error occurred while changing multiplier' }), { status: 500 });
    }
}