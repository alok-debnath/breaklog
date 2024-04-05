import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default prisma;

export async function connect() {
  try {
    // prisma.$connect is used to avoid the initial lazy connect of prisma and connect instantly (in most cases it's unnecessary)
    await prisma.$connect();
    console.log('Prisma connected successfully to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
