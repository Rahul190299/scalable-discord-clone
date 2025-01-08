import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';
import { number, string } from 'zod';

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const page = searchParams.get('page');
    const channelId = searchParams.get('channelId')
    let searchKeyword = searchParams.get('keyword');
    if(!searchKeyword){
        searchKeyword = "";
    }
    if (!profile || ! channelId || !page) return new NextResponse('Unauth', { status: 401 });

    let messages: Message[] = [];
    let searchMessagesResults = await db.message.count({
      where : {
        content : {
          contains : searchKeyword,
          
        },
        channelId : channelId,
      },
    });
    messages = await db.message.findMany({
      where : {
        content : {
          contains : searchKeyword,
          
        },
        channelId : channelId,
      },
      orderBy : {createdAt : 'desc'},
      take : searchMessagesResults/Number(page),
    });

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
