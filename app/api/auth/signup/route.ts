import { NextApiRequest, NextApiResponse } from 'next';
//@ts-ignore
import bcrypt from 'bcryptjs';
//@ts-ignore
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { z } from 'zod';
import { db } from '@/lib/db';
import Auth from '@/lib/auth';
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
    let strError : string = "";
    let bGoAhead : boolean = true;
    const { email, password ,username} = SignupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db.profile.findUnique({
      where: { userId : email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const promise = Auth.signWithJWT(password);
    promise
    .then( async (hashedPassword) => {
      // Save the new user in the database
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
          
        }else{
          res.status(500).json({message : 'failed to create user'});
        }

        // Return success response with redirect URL
        res.status(200).json({ message: 'User created successfully', redirect: '/profile' });
      }
    
    })
    .catch((error) => {
      return res.status(400).json({ message: error }); 
    }) 

    
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    // Handle other errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
