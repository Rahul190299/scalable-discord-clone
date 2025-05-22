import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

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
    let searchMessagesResultsCount = await db.message.count({
      where : {
        content : {
          contains : searchKeyword,
          
        },
        channelId : channelId,
      },
    });
    if(searchMessagesResultsCount == 0){
      return NextResponse.json({
        data : "No content",
        count : 0,
        currentPage : page,
        totalPages : 0,
      },{status : 200});
    }
    else{
      let skip = (Number(page)-1)*MESSAGES_BATCH;
      if(skip < MESSAGES_BATCH){
        skip = 0;
      }
      messages = await db.message.findMany({
        where : {
          content : {
            contains : searchKeyword,
            
          },
          channelId : channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy : {createdAt : 'desc'},
        take : MESSAGES_BATCH,
        skip : skip,
        
      });
      return NextResponse.json({
        messages : messages,
        count : searchMessagesResultsCount,
        currentPage : page,
        totalPages : Math.ceil(searchMessagesResultsCount/MESSAGES_BATCH),
      },{status : 200});
    }
    
  } catch (error) {
    console.log('[Messages GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
