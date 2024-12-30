import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get('cursor');
    

    let searchKeyword = searchParams.get('keyword');
    if(!searchKeyword){
        searchKeyword = "";
    }
    if (!profile) return new NextResponse('Unauth', { status: 401 });

    let messages: Message[] = [];
    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
            content : {
                contains : searchKeyword,
              }
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          content : {
            contains : searchKeyword,
          }
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log('[Messages GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
