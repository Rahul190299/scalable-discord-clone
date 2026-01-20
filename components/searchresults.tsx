"use client";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import SearchMessagesResult from "./chat/search-messages";
import Spinner from "./ui/spinner";
import { Member, Message, Profile } from "@prisma/client";
import { useSearchMessagesStore } from "@/store/searchstore";
import { Button } from "./ui/button";
import { usePageStore } from "@/store/sessionstore";

interface SearchMessagesProps {
  member: Member;
  apiUrl: string;
  paramKey: "channelId";
  paramValue: string;
}
export const SearchResults = (props: SearchMessagesProps) => {
  const [activeButton, setActiveButton] = useState("old"); // Track the active button
  const [loading, setLoading] = useState(true);
  const [count, setMessageCount] = useState(0);
  const { setCurrentPage } = usePageStore();
  return (
    <div className="dark:text-white dark:bg-neutral-800">
      <div className="flex justify-around text-lg  p-1 font-sans">
        <div>
          {loading ? (
            <div className="flex justify-center my-2">
              <span>Searching</span>
              <Spinner />
            </div>
          ) : (
            <span>{count} Results</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeButton === "old" ? "branding" : "toggle"}
            size={"sm"}
            onClick={() => {
              setActiveButton("old");
              setCurrentPage(1);
            }}
          >
            Old
          </Button>
          <Button
            variant={activeButton === "new" ? "branding" : "toggle"}
            onClick={() => {
              setActiveButton("new");
              setCurrentPage(1);
            }}
            size={"sm"}
          >
            New
          </Button>
        </div>
      </div>
      <SearchMessagesResult
        member={props.member}
        apiUrl="/api/search-messages"
        paramKey="channelId"
        paramValue={props.paramValue}
        setLoading={setLoading}
        setMessageCount={setMessageCount}
        sortOrder={activeButton === "new" ? "desc" : "asc"}
      />
    </div>
  );
};
