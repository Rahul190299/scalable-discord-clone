import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie  from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { StringValidation } from 'zod';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Store this in .env

export default class Auth {
  
    public static async signWithJWT(password:string) :Promise<string | null>{
        try{
           const salt = bcrypt.getSalt(10);
           return  await bcrypt.hash(password,salt); 

        }catch(error){
            console.log(error);
            return null;
        }
    }

    public static async comparePassword(enteredPass:string ,hashedPassword:string) : Promise<boolean |null>{
        try{
            return await bcrypt.compare(enteredPass,hashedPassword);

        }catch(error){
            console.log(error);
            return null;
        }
    }

    public static generateToken(userId:string,email : string) :string|null{
        try {
          // Create a JWT
          const token = jwt.sign(
            { id: userId, email: email }, // Payload
            JWT_SECRET,
            { expiresIn: "1d" } // Token expiration time
          );
          return token;
        } catch (error) {
            return null;
        }
    }

    public static verifySessionToken(session :string) : any{
        let res = null;
        try {
            const decoded = jwt.verify(session,JWT_SECRET);
            if(decoded){
              res = decoded;
              // Refresh the session cookie by resetting its expiration to 1 hour
              Auth.setTokenCookie(res, decoded); // No need to regenerate the token

              return decoded; // Return the decoded token data (user info)
            }
        } catch (error) {
            
        }
        return res;
    }

    public static setTokenCookie(res:NextApiResponse,token:string){
        try {
            res.setHeader(
                "Set-Cookie",
                cookie.serialize('token',token,{
                    httpOnly:true,
                    secure :  process.env.NODE_ENV !== 'development', // Use HTTPS in production
                    maxAge : 60*60,
                    sameSite : 'lax',
                    path : "/"
                })
            )
        } catch (error) {
            
        }
    }
}