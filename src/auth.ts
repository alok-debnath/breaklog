import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
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
          // throw new Error('Email and password are required');
          return null;
        }

        const account = await prisma.account.findFirst({
          where: {
            provider: "credentials",
            providerAccountId: credentials.email,
          },
          include: { user: true },
        });

        if (!account || !account.user) {
          // throw new Error('Invalid credentials');
          return null;
        }

        if (!account.access_token) {
          // throw new Error('No password set for this account');
          return null;
        }

        if (
          !credentials?.email ||
          !credentials?.password ||
          typeof credentials.password !== "string"
        ) {
          // throw new Error('Email and password are required');
          return null;
        }

        const valid = await compare(credentials.password, account.access_token);
        if (!valid) {
          // throw new Error('Invalid credentials');
          return null;
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
    async jwt({ token, user }) {
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
          // If user exists and is not verified, update verification status
          if (!existingUser.isVerified) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                isVerified: true,
                emailVerified: new Date(),
              },
            });
          }

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
    },
  },
  // secret: process.env.TOKEN_SECRET,
});
