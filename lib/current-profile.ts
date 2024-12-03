//import { auth } from '@clerk/nextjs';

import { db } from "@/lib/db";
import { cookies } from "next/headers"; // To access cookies in server-side component
import cookie from "cookie";
import Auth from "@/lib/auth";

export const currentProfile = async () => {
  try {
    let userId = null;
    let user = null;
    const cookieStore = cookies();
    const cookieString = cookieStore.get("Set-Cookie")?.value;
    if (!cookieString) {
      return null;
    }
    const parsedCookies = cookie.parse(cookieString || "");
    user = Auth.verifySessionToken(parsedCookies.token);
    if(!user){
        return null;
    }
    userId = user.id;
    const profile = await db.profile.findUnique({
      where: {
        id: userId,
      },
    });
    return profile;
  } catch (error) {
    return null;
  }
};
