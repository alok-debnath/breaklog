// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find account for Credentials provider
        const account = await prisma.account.findFirst({
          where: {
            provider: "credentials",
            providerAccountId: credentials.email,
          },
          include: { user: true },
        });

        if (!account || !account.user) {
          throw new Error("Invalid credentials");
        }

        if (!account.access_token) {
          throw new Error("No password set for this account");
        }

        const valid = await compare(credentials.password, account.access_token);
        if (!valid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: account.user.id,
          email: account.user.email,
          name: account.user.name ?? undefined,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            },
            update: {},
            create: {
              userId: existingUser.id,
              type: "oauth",
              provider: "google",
              providerAccountId: account.providerAccountId,
              access_token: account.access_token ?? undefined,
              refresh_token: account.refresh_token ?? undefined,
            },
          });
        }
      }

      return true;
    }
  },
  secret: process.env.TOKEN_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
