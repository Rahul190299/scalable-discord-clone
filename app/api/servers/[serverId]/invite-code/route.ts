import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function PATCH(
    req: Request,
    context  : {params : Promise<string>}
) {
    try {
        const serverId = await context.params;
        const profile = await currentProfile();
        if (!profile) return new NextResponse('UnAuth', { status: 401 });

        if (!serverId)
            return new NextResponse('missing server id', { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4(),
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}
