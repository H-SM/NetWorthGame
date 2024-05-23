// src/pages/api/fetchLeaderboard.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { redis } from '@/app/lib/redis';
import { PrismaClient, User } from '@prisma/client';

const CACHE_EXPIRY = 40 * 60; // 40 min

const prisma = new PrismaClient();
export async function GET(req: Request) {
    try {
        // Check if the leaderboard is in Redis
        const cachedLeaderboard = await redis.get("leaderboard2");
        if (cachedLeaderboard) {
            console.log('cached it');
            const leaderboard = JSON.parse(cachedLeaderboard);
            return NextResponse.json(leaderboard);
        }

        // Fetch data from Prisma if not in Redis
        const leaderboard = await prisma.userScores.findMany({
            take: 20,
            orderBy: {
                totalWorth: 'desc',
            },
            select: {
                user: {
                    select: {
                        dynamicUserId: true,
                        settings: {
                            select: {
                                username: true,
                                picture: true,
                            },
                        },
                    },
                },
                multiplier: true,
                netWorth: true,
                totalWorth: true
            },
        });

        // Calculate the score for each user
        const formattedLeaderboard = leaderboard.map((entry) => ({
            dynamicUserId: entry.user.dynamicUserId,
            username: entry.user.settings?.username || '',
            profilePicture: entry.user.settings?.picture || '',
            score: entry.multiplier * entry.netWorth,
        }));

        await redis.setex("leaderboard2", CACHE_EXPIRY, JSON.stringify(formattedLeaderboard));

        // Return the response
        return NextResponse.json(formattedLeaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return new Response(null, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}