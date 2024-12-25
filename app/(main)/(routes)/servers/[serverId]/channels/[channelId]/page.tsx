import { FC } from "react";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { SearchResults } from "@/components/searchresults";
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
    <div className="flex h-full">
      <div className="basis-2/6 h-10 w-10">
        <SearchResults/>
      </div>
      <div className="basis-4/6">
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
          <ChatHeader
            name={channel.name}
            serverId={channel.serverId}
            type="channel"
          />
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
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
      </div>
    </div>
  );
};

export default ChannelIdPage;
