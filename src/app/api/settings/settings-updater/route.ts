import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(request: NextRequest,) {
    try {
        const body = await request.json();
        const { dynamicUserId, username, picture } = body;

        if (!dynamicUserId) {
            return new NextResponse(JSON.stringify({ error: 'dynamicUserId is required' }), { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { dynamicUserId },
            include: {
                settings: true,
            },
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        // if(username === "" && picture === ""){
        //     return new NextResponse(JSON.stringify({ error: 'No data to change' }), { status: 404 });
        // }
        // Update the settings
        const updatedSettings = await prisma.userSettings.update({
            where: { userId: dynamicUserId },
            data: { username, picture },
        });

        return NextResponse.json(updatedSettings);
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: 'An error occurred while changing multiplier' }), { status: 500 });
    }
}