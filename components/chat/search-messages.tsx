'use client';
import { Member, Message, Profile } from '@prisma/client';
import { ElementRef, FC, Fragment, useRef } from 'react';
import ChatWelcome from './chat-welcome';
import { Loader2, ServerCrash } from 'lucide-react';
import { useChatSearch } from '@/hooks/use-chat-search';
import ChatItem from './chat-item';
import { format } from 'date-fns';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { useChatScroll } from '@/hooks/use-chat-scroll';

type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

const ChatMessages: FC<ChatMessagesProps> = ({
  apiUrl,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);
  console.log(apiUrl);
  const { data,error, status } =
    useChatSearch({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
    console.log(data);
  if (status === 'loading') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col justify-end py-4 overflow-y-auto border-blue-500 border-2 ">
      
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group :any, i:any) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                content={message.content}
                member={message.member}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdate={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
