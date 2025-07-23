import qs from "query-string";
import { useQuery } from "@tanstack/react-query";
import { da } from "date-fns/locale";
import { useSearchStore } from "@/store/searchstore";
interface ChatQueryProps {
  currentPage: number;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  sortOrder : string;
}

export const useChatSearch = ({
  apiUrl,
  paramKey,
  paramValue,
  currentPage,
  sortOrder
}: ChatQueryProps) => {
  const { searchText } = useSearchStore();
  const searchMessages = async (currentPage : string) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          page: currentPage,
          [paramKey]: paramValue,
          "keyword" : searchText,
          "sort" : sortOrder,
        },
      },
      { skipNull: true }
    );
    console.log("search api url" + apiUrl);
    const res = await fetch(url);
    let searchMessages = await res.json();
    console.log("search result " + searchMessages);
    return searchMessages;
  };

  const { status, error, data } = useQuery({
    queryKey: [currentPage + searchText],
    queryFn: () =>  searchMessages(currentPage.toString()),
    cacheTime: 0,   
  });
  return {status,error,data}; 
};
