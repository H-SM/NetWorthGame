// const cron = require('node-cron');
// const redis = require('./lib/redis');
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { redis } from '@/app/lib/redis';

const prisma = new PrismaClient();

const updateLeaderboardCache = async () => {
  try {
  console.log('')
  console.log('######################################')
  console.log('#                                    #')
  console.log('# Running scheduler every 40 minutes #')
  console.log('#                                    #')
  console.log('######################################')
  console.log('')
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
        totalWorth: true,
      },
    });

    // Calculate the score for each user
    const formattedLeaderboard = leaderboard.map((entry) => ({
      dynamicUserId: entry.user.dynamicUserId,
      username: entry.user.settings?.username || '',
      profilePicture: entry.user.settings?.picture || '',
      score: entry.multiplier * entry.netWorth,
    }));

    // Update the Redis cache
    await redis.set('leaderboard2', JSON.stringify(formattedLeaderboard), 'EX', 3600); // Expire after 1 hour
  } catch (error) {
    console.error('Error updating leaderboard cache:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Schedule the cron job to run every 40 minutes
cron.schedule('*/40 * * * *', updateLeaderboardCache);