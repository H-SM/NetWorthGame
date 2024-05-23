import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(request: NextRequest,) {
    try {
        const body = await request.json();
        const { dynamicUserId } = body;

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

        const currentTime = new Date();
        const lastUpdateTime = user.scores?.updatedAt;
        const timeDiffInMinutes = lastUpdateTime ? Math.floor((currentTime.getTime() - lastUpdateTime.getTime()) / (1000 * 60)) : Infinity;
    
        if (timeDiffInMinutes < 60) {
          return NextResponse.json(user.scores);
        }
        
        // Update the multiplier value
        let multiplier = 1;
        
        if (user.scores?.multiplier) {
            multiplier = user.scores?.multiplier + 1;
        }
    
        const updatedScores = await prisma.userScores.update({
            where: { userId: dynamicUserId },
            data: { multiplier },
        });

        return NextResponse.json(updatedScores);
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: 'An error occurred while changing multiplier' }), { status: 500 });
    }
}