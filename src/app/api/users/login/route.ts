import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody;

        // check if user exists
        const user = await prisma.user.findUnique({where: {email}})
        if (!user) {
            return NextResponse.json({
                error: "User does not exist"
            }, {status: 400})
        }

        // check if password is correct
        const validatePassword = await bcryptjs.compare(password, user.password)
        if (!validatePassword) {
            return NextResponse.json({
                error: "Invalid password"
            }, {status: 400})
        }

        // create token data
        const tokenData = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        // create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET as string, {
            expiresIn: "1d"
        })
        const reponse = NextResponse.json({
            message:"Login successful",
            success: true,
        })
        reponse.cookies.set("token", token,{
            httpOnly: true,
        })

        return reponse;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }),
            ({ status: 500 })
    }
}