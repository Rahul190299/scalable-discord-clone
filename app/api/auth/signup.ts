import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { z } from 'zod';
import { db } from '@/lib/db';
// Initialize Prisma Client
//const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Define the input schema using Zod
const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  username : z.string(),
});

// Define the handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    // Validate input using Zod
    const { email, password ,username} = SignupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db.profile.findUnique({
      where: { userId : email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user in the database
    const newUser = await db.profile.create({
      data: {
        email,
        password: hashedPassword,
        userId : email,
        name : username,
        imageUrl : "",
      },
    });

    // Create a JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email }, // Payload
      JWT_SECRET,
      { expiresIn: '1d' } // Token expiration time
    );

    // Set the token in a cookie
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true, // Prevents access from JavaScript
      secure: process.env.NODE_ENV !== 'development', // Use HTTPS in production
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'strict',
      path: '/',
    }));

    // Return success response with redirect URL
    res.status(201).json({ message: 'User created successfully', redirect: '/profile' });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    // Handle other errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
