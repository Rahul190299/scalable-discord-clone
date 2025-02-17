import qs from "query-string";
import { useQuery } from "@tanstack/react-query";
import { da } from "date-fns/locale";

interface ChatQueryProps {
  currentPage: number;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}

export const useChatSearch = ({
  apiUrl,
  paramKey,
  paramValue,
  currentPage,
}: ChatQueryProps) => {
  const searchMessages = async (currentPage : number) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          page: currentPage,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );
    console.log("search api url" + apiUrl);
    const res = await fetch(url);
    return res.json();
  };

  const { status, error, data } = useQuery({
    queryKey: [currentPage],
    queryFn: ({queryKey}) =>  searchMessages(currentPage),
    staleTime : 500,
  });
  return {status,error,data}; 
};
