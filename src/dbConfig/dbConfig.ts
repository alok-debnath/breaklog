// import mongoose from "mongoose";

// export async function connect() {
//     try {
//         await mongoose.connect(process.env.MONGO_URL!
//             // , {
//             //     useNewUrlParser: true,
//             //     useUnifiedTopology: true,
//             // }
//         );

// const connection = mongoose.connection;

// connection.on('connected', () => {
//     console.log('MongoDB connected successfully');
// });

// connection.on('error', (err) => {
//     console.error('MongoDB connection error. Please make sure MongoDB is running. ' + err);
//     process.exit(1); // Exit with a non-zero code to indicate an error
// });
//     } catch (error) {
//         console.log('Something went wrong!');
//         console.log(error);
//     }
// }

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function connect() {
    try {
        await prisma.$connect();
        console.log('Prisma connected successfully to the database');
    } catch (error: any) {
        return new Error(error.message);
        // process.exit(1);
    } 
    // finally {
    //     await prisma.$disconnect();
    // }
}