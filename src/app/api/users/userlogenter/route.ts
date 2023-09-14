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


        const log = await prisma.log.create({
            data: {
                User: {
                    connect: { id: userId },
                },
                createdAt: datetime,
                log_status: "enter",
            },
        });

        return NextResponse.json({
            message: "Log fetched successfully",
            data: log,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

}