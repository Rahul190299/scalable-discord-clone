"use client";
import { Member, Message, Profile } from "@prisma/client";
import {
  Dispatch,
  ElementRef,
  FC,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Loader2, ServerCrash } from "lucide-react";
import { useChatSearch } from "@/hooks/use-chat-search";
import ChatItem from "./chat-item";
import { format } from "date-fns";
import { Pagination } from "../Searching/pagination";

type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface SearchMessagesProps {
  member: Member;
  apiUrl: string;
  paramKey: "channelId";
  paramValue: string;
  sortOrder: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setMessageCount: Dispatch<SetStateAction<number>>;
}

const SearchMessagesResult: FC<SearchMessagesProps> = ({
  apiUrl,
  member,
  paramKey,
  paramValue,
  setLoading,
  setMessageCount,
  sortOrder,
}) => {
  //const queryKey = `chat:${chatId}`;
  const [currentPage, setCurrentPage] = useState(1);

  console.log(apiUrl);
  const { data, error, status } = useChatSearch({
    currentPage,
    apiUrl,
    paramKey,
    paramValue,
    sortOrder,
  });
  useEffect(() => {
    if (data) {
      setLoading(false);
      setMessageCount(data?.count);
    }
  }, [data, setMessageCount,setLoading]);

  console.log(data);
  console.log("status => " + status);
  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{`${error}`}</p>
      </div>
    );
  }

  if (data?.count == 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
        <p className="text-lg font-medium text-gray-200">
          We searched far and wide.
        </p>
        <p className="text-gray-400">Unfortunately, no results were found.</p>
      </div>
    );
  }
  return (
    <>
      <div className="flex-1 flex flex-col justify-end py-4 overflow-y-auto border-blue-500 border-2 ">
        <div className="flex flex-col mt-auto">
          {data?.messages?.map((message: any, i: any) => (
            <Fragment key={i}>
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
                socketUrl=""
                socketQuery={{ " ": "" }}
                fromSearchMessages={true}
              />
            </Fragment>
          ))}
        </div>
      </div>
      <Pagination
        totalPages={data?.count}
        setSelectedPage={setCurrentPage}
        currentSelectedPage={currentPage}
      />
    </>
  );
};

export default SearchMessagesResult;
