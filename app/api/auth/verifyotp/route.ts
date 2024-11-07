import { NextApiRequest, NextApiResponse } from "next";
import { db } from '@/lib/db';



export default async function handler(req : NextApiRequest,res:NextApiResponse){
    try{
        let bSuccess : boolean = false;
        let strMessage : string = "";
        let strRedirect : string = "";
        if(req.method != 'POST'){
            return res.status(405).json({message : "only post request allowed"});
        }

        const {email,otp} = req.body();
        if(!email || ! otp){
            return res.status(400).json({message : "missing parameters"});
            
        }
        const user = await db.profile.findUnique({
            where : {userId : email}
        });
        if(!user){
            return res.status(404).json({message : "user does not exits"});
        }
        if(user.isVerified){
            bSuccess = true;
            strMessage = "user already verified";
        }
        else{
            const userOtp = user.otp;
            if(otp === userOtp){
                bSuccess = true;
                strMessage = "otp verified successfully";
            }
            else{
                strMessage = "otp verification failed";
            }
            
        }
        if(bSuccess == true){
            const server = await db.server.findFirst({
                where: {
                    members: {
                        some: {
                            profileId: user.id,
                        },
                    },
                },
            });
            if(server){
                strRedirect = `/servers/${server.id}`;
            }
            else{
                strRedirect = "/";
            }
            
        }
        return res.status(200).json({ result : bSuccess,message : strMessage,redirect : strRedirect});
    }catch(error){
        res.status(500).json({message : "Internal server error"})
    }
}