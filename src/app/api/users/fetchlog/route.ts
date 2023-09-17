import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

connect();

export async function POST(request: NextRequest) {
    try {
        // Get user ID from token
        const userId = await getDataFromToken(request);

        // Calculate the start of today in UTC time
        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0);

        // Fetch logs for the current day
        const logs = await prisma.log.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startOfToday,
                },
            },
            select: {
                id: true,
                createdAt: true,
                log_status: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Initialize variables
        let breakTime = 0;
        let workDone = 0;
        let logExit = 0;
        let logEnter = 0;
        let dayStart = 0;
        let dayEnd = 0;
        let isDayStarted = false;
        let isDayEnded = false;
        let currentBreakTime = null;
        let recentLog = null;

        // Process logs
        for (const log of logs) {
            if (log.log_status === 'day start') {
                isDayStarted = true;
                dayStart = log.createdAt.getTime();
            } else if (log.log_status === 'day end') {
                isDayEnded = true;
                dayEnd = log.createdAt.getTime();
            }

            if (isDayStarted) {
                if (log.log_status === 'exit') {
                    logExit = log.createdAt.getTime();
                } else if (log.log_status === 'enter') {
                    logEnter = log.createdAt.getTime();
                }

                if (logExit !== 0 && logEnter !== 0) {
                    breakTime += logEnter - logExit;
                    logExit = 0;
                    logEnter = 0;
                }
            }
        }

        // the most recent log
        const lastLog = logs[logs.length - 1];
        // Calculate work done
        if (isDayStarted) {
            if (isDayEnded) {
                workDone = dayEnd - dayStart - breakTime;
            } else {
                const currDay = new Date();
                workDone = currDay.getTime() - dayStart - breakTime;

                if (lastLog.log_status === 'exit') {
                    const exitTime = currDay.getTime() - lastLog.createdAt.getTime();
                    workDone = workDone - exitTime;
                }
            }
        }

        // Determine current break time and recent log status
        if (logs.length > 0) {
            if (lastLog.log_status === 'exit') {
                currentBreakTime = lastLog.createdAt;
            }
            recentLog = lastLog.log_status;
        }

        // Format time
        const formatTime = (milliseconds: number) => {
            const totalSeconds = Math.floor(milliseconds / 1000);
            const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        };

        const formattedTime = formatTime(breakTime);
        const formattedWorkDone = formatTime(workDone);

        return NextResponse.json({
            message: 'Logs fetched successfully',
            data: logs,
            workdata: {
                breakTime: formattedTime,
                currentBreak: currentBreakTime,
                lastLogStatus: recentLog,
                workDone: formattedWorkDone,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
