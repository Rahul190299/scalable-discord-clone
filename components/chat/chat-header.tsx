import { FC } from 'react';

import { Hash } from 'lucide-react';
import MobileToggle from '../mobile-toggle';
import { SocketIndicator } from '../socket-indicator';
import { SearchMessages } from '../searchbar';
interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
}

const ChatHeader: FC<ChatHeaderProps> = ({
  name,
  serverId,
  type,
  imageUrl,
}) => {
  return (
    <div className="text-md h-12 font-semibold border-blue-500 px-3 flex items-center  border-neutral-200 dark:border-neutral-800 dark:bg-[#313338]  border-b-2">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        <SearchMessages/>
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
