import { connect } from "@/dbConfig/dbConfig"
import { getDataFromToken } from "@/helpers/getDataFromToken"
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

connect();

export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const reqBody = await request.json();
        const { datetime } = reqBody;

        const currentDate = new Date(datetime);
        const currentHour = currentDate.getHours();
        const currentDay = currentDate.getDate();

        const startOfToday = new Date();
        startOfToday.setUTCHours(6, 0, 0, 0); // Set start time to 6:00:00.000Z

        const startOfYesterday = new Date();
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        startOfYesterday.setUTCHours(6, 0, 0, 0); // Set start time to 6:00:00.000Z

        let whereCondition = {};


        if (
            (currentHour >= 6 && currentDay === startOfToday.getDate()) ||
            (currentHour <= 5 && currentDay === startOfYesterday.getDate())
        ) {
            // If user logs between 6am and 11:59pm (current day) or between 12:01am and 5:59am (next day), fetch logs accordingly
            if (currentHour >= 6 && currentDay === startOfToday.getDate()) {
                whereCondition = {
                    userId: userId,
                    createdAt: {
                        gt: startOfToday,
                    },
                };
            } else if (currentHour <= 5 && currentDay === startOfYesterday.getDate()) {
                whereCondition = {
                    userId: userId,
                    createdAt: {
                        gt: startOfYesterday,
                        lt: startOfToday,
                    },
                };
            }
        }


        const logs = await prisma.log.findMany({
            where: whereCondition,
            select: {
                id: true,
                createdAt: true,
                log_status: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            message: "Logs fetched successfully",
            my: whereCondition,
            data: logs,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

}