import qs from "query-string";
import { useQuery } from "@tanstack/react-query";
import { da } from "date-fns/locale";
import { useSearchStore } from "@/store/searchstore";
interface ChatQueryProps {
  currentPage: number;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  sortOrder: string;
}

export const useChatSearch = ({
  apiUrl,
  paramKey,
  paramValue,
  currentPage,
  sortOrder,
}: ChatQueryProps) => {
  const { searchText } = useSearchStore();
  const searchMessages = async (
    currentPage: string,
    keyword: string,
    sort: string
  ) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          page: currentPage,
          [paramKey]: paramValue,
          keyword,
          sort,
        },
      },
      { skipNull: true }
    );

    console.log("search api url", url);
    const res = await fetch(url);
    const result = await res.json();
    console.log("search result", result);
    return result;
  };

  const { status, error, data } = useQuery({
    queryKey: ['messages', currentPage, searchText, sortOrder], // include all dependencies
    queryFn: () => searchMessages(currentPage.toString(), searchText, sortOrder),
    cacheTime: 0,
  });
  return { status, error, data };
};
