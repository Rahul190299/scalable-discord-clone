import { NextApiRequest, NextApiResponse } from 'next';
//@ts-ignore
import bcrypt from 'bcryptjs';
//@ts-ignore
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { z } from 'zod';
import { db } from '@/lib/db';
import Auth from '@/lib/auth';
import crypto from 'crypto';
import { Nodemailer } from '@/lib/nodemailer';
import { NextRequest, NextResponse } from 'next/server';
// Define the input schema using Zod
const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  username : z.string(),
});

// Define the handler
export  async function POST(req: NextRequest) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Only POST requests allowed' },{status : 405});
  }

  try {
    // Validate input using Zod
    let strError : string = "";
    let bGoAhead : boolean = true;
    const { email, password ,username} = SignupSchema.parse(await req.json());

    // Check if user already exists
    const existingUser = await db.profile.findUnique({
      where: { userId : email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await  Auth.signWithJWT(password);
    if(hashedPassword){
      const newUser = await db.profile.create({
        data: {
          email,
          password: hashedPassword,
          userId : email,
          name : username,
          imageUrl : "",
          isVerified : false,
          otp : "",
          otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),  

        },
      });
      if(newUser){
        //lets send otp to verify mail
        const otp = crypto.randomInt(100000, 999999);
        const bRes = await Nodemailer.SendMail(email,otp);
        if(bRes){
          await db.profile.update({
            where: {userId: email },
            data: { otp: otp.toString() },
          });
          strError = "otp sent successfully";
        }
        else{
          bGoAhead = false;
        }
        
      }else{
        NextResponse.json({message : 'failed to sign up user'},{status : 500});
      }

      if(bGoAhead){
        // Return success response with redirect URL
         return NextResponse.json({ message: 'User created successfully', redirect: '/verifyotp' },{status : 200});
      }
      else{
        return NextResponse.json({ message: 'User created successfully', redirect: '/verifyotp' },{status : 200});
      }
      
    }
    else{
      return NextResponse.json({message : "failed to hash password"},{status : 500});
    }

    
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message },{status : 500});
    }
    // Handle other errors
    return NextResponse.json({ message: 'Internal Server Error' },{status : 500});
  }
}
