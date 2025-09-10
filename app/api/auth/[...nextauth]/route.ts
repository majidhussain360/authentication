import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../../generated/prisma';
import NextAuth from "next-auth";


const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {label: 'email', type: 'text'},
                password: {label: 'Password', type: 'password'}
            },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                return null;
            }
            const user = await prisma.user.findUnique({ where: { email: credentials.email } });
            if (!user) {
                return null;
            }
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            if (!isPasswordValid) {
                return null;
            }
            const { password, ...userWithoutPassword } = user;
            return { ...userWithoutPassword, id: String(user.id) };
        }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    session:{
        strategy: 'jwt' as const,
    },
    secret: process.env.JWT_SECRET,
    
    
};




export const POST = NextAuth(authOptions);
export const GET = NextAuth(authOptions);