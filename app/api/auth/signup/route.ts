import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const { email, password, name } = await request.json();
    if (!email || !password || !name) {
        return NextResponse.json({message: 'Missing required fields'}, {status: 400});
    }
    const insertingUser = await prisma.user.create({
        data:{
            email,
            password: await bcrypt.hash(password, 10),
            name
        }
    });
    return NextResponse.json(insertingUser);
}