"use client";
import { useState } from "react";
import { Dispatch, SetStateAction } from 'react';
import SearchMessagesResult from "./chat/search-messages";
import Spinner from "./ui/spinner";
import { Member, Message, Profile } from '@prisma/client';
import { useSearchMessagesStore } from "@/store/searchstore";
import { Button } from "./ui/button";


interface SearchMessagesProps {
  member: Member;
  apiUrl: string;
  paramKey: 'channelId';
  paramValue: string;
}
export const SearchResults = (props:SearchMessagesProps) => {
  const [activeButton, setActiveButton] = useState("old"); // Track the active button
  const [result, setResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [count,setMessageCount] = useState(0);
  return (
    <div>
      <div className="flex justify-around dark:bg-gray-800 p-1">
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
        variant={activeButton === 'old' ? 'branding' : 'toggle'}
        size={'sm'}
        onClick={() => setActiveButton('old')}
      >
        Old
      </Button>
      <Button
        variant={activeButton === 'new' ? 'branding' : 'toggle'}
        onClick={() => setActiveButton('new')}
        size={'sm'}
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
        setLoading = {setLoading}
        setMessageCount={setMessageCount}
      />
    </div>
  );
};
