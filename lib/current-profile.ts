//import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

export const currentProfile = async () => {
    const  userId  = null;

    if (!userId) return null;

    const profile = await db.profile.findUnique({
        where: {
            userId,
        },
    });
    return profile;
};
