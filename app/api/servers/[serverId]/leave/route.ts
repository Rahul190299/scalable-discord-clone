import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  context  : {params : Promise<string>}
) {
  try {
    const serverId = await context.params;
    const profile = await currentProfile();

    if (!profile) return new NextResponse('Unauth', { status: 401 });

    if (!serverId)
      return new NextResponse('Server Id Missing', { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('Server Id Leave', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
