import qs from "query-string";
import { useQuery } from "@tanstack/react-query";
import { da } from "date-fns/locale";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId";
  channelId: string;
}

export const useChatSearch = ({
  apiUrl,
  paramKey,
  channelId,
  queryKey,
}: ChatQueryProps) => {
  const searchMessages = async (queryKey : string) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          page: queryKey,
          [paramKey]: channelId,
        },
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { status, error, data } = useQuery({
    queryKey: [queryKey],
    queryFn: ({queryKey}) =>  searchMessages(queryKey[0]),
    staleTime : 500,
  });
  return {status,error,data}; 
};
