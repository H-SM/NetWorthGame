import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, User } from '@prisma/client';
import { generateUsername } from "unique-username-generator";

const prisma = new PrismaClient();
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const dynamicUserId = searchParams.get('dynamicUserId');

        if (!dynamicUserId) {
            return new NextResponse(JSON.stringify({ error: 'dynamicUserId is required' }), { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { dynamicUserId },
            include: {
                settings: true,
                scores: true,
            },
        });
        if (!user) {
            return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        console.log("GET" ,user);
        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: 'An error occurred while fetching the user' }), { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { dynamicUserId, picture, username, theme, multiplier, netWorth, totalWorth } = body;

        if(username === "" ){
            username = generateUsername("", 0, 15);
        }
        if (!dynamicUserId) {
            return new NextResponse(JSON.stringify({ error: 'dynamicUserId is required' }), { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { dynamicUserId },
        });

        if (existingUser) {
            return new NextResponse(JSON.stringify({ error: 'User already exists' }), { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                dynamicUserId,
                settings: {
                    create: {
                        username,
                        picture,
                        theme,
                    },
                },
                scores: {
                    create: {
                        multiplier,
                        netWorth,
                        totalWorth
                    },
                },
            },
            include: {
                settings: true,
                scores: true,
            },
        });
        console.log("POST" , newUser);

        return new NextResponse(JSON.stringify(newUser), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: 'An error occurred while creating the user' }), { status: 500 });
    }
}
