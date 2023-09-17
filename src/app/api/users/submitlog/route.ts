import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

connect();

export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const reqBody = await request.json();
        const { logtype } = reqBody;

        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0); // Set start time to 00:00:00.000Z

        const recentLog = await prisma.log.findFirst({
            where: {
                userId: userId,
                createdAt: {
                    gte: startOfToday,
                },
            },
            select: {
                log_status: true,
                id: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (logtype === 'undo log') {
            if (recentLog !== null) {
                await prisma.log.delete({
                    where: {
                        id: recentLog.id,
                    },
                });
            }
        }

        let logToBeSaved = '';

        if (logtype === 'basic log') {
            if (recentLog === null) {
                logToBeSaved = 'day start';
            } else if (recentLog.log_status === 'day start') {
                logToBeSaved = 'exit';
            } else if (recentLog.log_status === 'enter') {
                logToBeSaved = 'exit';
            } else if (recentLog.log_status === 'exit') {
                logToBeSaved = 'enter';
            }
        } else if (logtype === 'day end') {
            logToBeSaved = 'day end';
        }

        if (logToBeSaved !== '') {
            const log = await prisma.log.create({
                data: {
                    User: {
                        connect: { id: userId },
                    },
                    // createdAt: datetime,
                    log_status: logToBeSaved,
                },
            });
        }

        return NextResponse.json({
            message: 'Log fetched successfully',
            // data: log,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
