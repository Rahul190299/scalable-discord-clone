import { FC } from "react";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { SearchContainer } from "@/components/search-container";
interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage: FC<ChannelIdPageProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/sign-in");

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) redirect(`/`);

  return (
    <div className="bg-white dark:bg-[#313338]">
      <div className="sticky top-0 z-50 dark:bg-white">
        <ChatHeader
          name={channel.name}
          serverId={channel.serverId}
          type="channel"
          
        />
      </div>
      
      <div className="flex ">
        <div className="basis-full min-h-screen">
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            apiUrl="/api/socket/messages"
            name={channel.name}
            type="channel"
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
        </div>
        <div className="overflow-y-auto h-screen">
          <SearchContainer
          member={member}
          chatId={channel.id}
          apiUrl="/api/search-messages"
          paramKey="channelId"
          paramValue={channel.id}
          />
        </div>
        
      </div>
    </div>
  );
};

export default ChannelIdPage;
