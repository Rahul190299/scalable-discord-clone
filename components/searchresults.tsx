"use client";
import { useState } from "react";
import { Dispatch, SetStateAction } from 'react';
import SearchMessagesResult from "./chat/search-messages";
import Spinner from "./ui/spinner";
import { Member, Message, Profile } from '@prisma/client';


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
  return (
    <div>
      <div className="flex justify-around bg-gray-200 p-1">
        <div>
          {loading ? (
            <div className="flex justify-center my-2">
              <span>Searching</span>
              <Spinner />
            </div>
          ) : (
            <span>{result} Results</span>
          )}
        </div>
        <div className="flex justify-center">
          <button
            className={`px-4 rounded 
                      ${
                        activeButton === "old"
                          ? "bg-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
          >
            New
          </button>
          <button
            className={`px-4 mx-2 rounded 
            ${
              activeButton === "new"
                ? "bg-gray-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Old
          </button>
          {/* <button>Relevant</button> */}
        </div>
      </div>
      <SearchMessagesResult
        member={props.member}
        apiUrl="/api/search-messages"
        paramKey="channelId"
        paramValue={props.paramValue}
        setLoading = {setLoading}
      />
    </div>
  );
};
