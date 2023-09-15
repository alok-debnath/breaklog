import { connect } from "@/dbConfig/dbConfig"
import { getDataFromToken } from "@/helpers/getDataFromToken"
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

connect();

export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0); // Set start time to 00:00:00.000Z

        const logs = await prisma.log.findMany({
            where: {
                userId: userId,
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

        //
        let breakTime = 0; // in seconds
        let workDone = 0; // in seconds

        let logExit = 0;
        let logEnter = 0;
        let dayStart = 0;
        let dayEnd = 0;
        let isDayStarted = false;
        let isDayEnded = false;

        let currentBreakTime = null;
        let recentLog = null;

        logs.map(log => {
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
                    breakTime = breakTime + (logEnter - logExit);
                    logExit = 0;
                    logEnter = 0;
                }
            }

        })
        if (isDayStarted) {
            if (isDayEnded) {
                workDone = (dayEnd - dayStart) - breakTime;
            } else {
                const currDay = new Date();
                workDone = (currDay.getTime() - dayStart) - breakTime;
            }
        }

        // Check if the logs array is not empty
        if (logs.length > 0) {
            const lastLog = logs[logs.length - 1];

            if (lastLog.log_status === 'exit') {
                currentBreakTime = lastLog.createdAt;
            }
            recentLog = lastLog.log_status;
        }

        const formatTime = (milliseconds: any) => {
            const totalSeconds = Math.floor(milliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
            const seconds = (totalSeconds % 60).toString().padStart(2, '0');

            return `${hours}:${minutes}:${seconds}`;
        };
        const formattedTime = formatTime(breakTime);
        const formattedWorkDone = formatTime(workDone);

        return NextResponse.json({
            message: "Logs fetched successfully",
            data: logs,
            workdata:
            // `${formattedTime}`,
            {
                breakTime: `${formattedTime}`,
                currentbreak: currentBreakTime,
                lastlogstatus: recentLog,
                workdone: formattedWorkDone
                // workDone: `${workDoneHours} hours ${workDoneMinutes} minutes`,
            },
        });
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

}