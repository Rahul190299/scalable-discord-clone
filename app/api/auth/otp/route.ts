import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { db } from "@/lib/db";

import crypto from "crypto";

import { Nodemailer } from "@/lib/nodemailer";
// Define the input schema using Zod
const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let strError: string = "";
    let bRes: boolean = false;
    if (req.method != "POST") {
      res.status(405).json({ message: "only POST request allowed" });
    }

    const { email } = SignupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db.profile.findUnique({
      where: { userId: email },
    });

    if (existingUser) {
      if (existingUser.isVerified) {
        strError = "user already verified go to dashboard";
      } else {
        const otp = crypto.randomInt(100000, 999999);
        const bResult: boolean = await Nodemailer.SendMail(
          email,
          otp
        );
        if (bResult) {
          await db.profile.update({
            where: {userId: email },
            data: { otp: otp.toString() },
          });
          strError = "otp sent successfully";
          bRes = true;
        } else {
          strError = "Failed to send email";
        }
      }
    } else {
      strError = "user does not exits with this email";
    }

    res.status(200).json({ message: strError, res: bRes });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
