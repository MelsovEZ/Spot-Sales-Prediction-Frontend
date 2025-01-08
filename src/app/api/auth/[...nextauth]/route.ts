import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if (user && (await bcrypt.compare(credentials.password, user.password))) {
                    return {
                        ...user,
                        id: user.id.toString()
                    };
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
