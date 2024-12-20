import { db } from '@/lib/db';

export const initialProfile = async (userId : string) => {
    
    
    const profile = await db.profile.findUnique({
        where: {
            id: userId,
        },
    });

    if (profile) return profile;

    

    return null;
};
