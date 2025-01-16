"use client";
import { useState } from "react";
import { SearchResults } from "./searchresults";
import { useSearchStore } from "@/store/searchstore";
import { Member, Message, Profile } from '@prisma/client';
import { ElementRef, FC, Fragment, useRef } from 'react';


interface SearchMessagesProps {
  member: Member;
  chatId: string;
  apiUrl: string;
  paramKey: 'channelId';
  paramValue: string;
}
export const SearchContainer : FC<SearchMessagesProps> = ({
  apiUrl,
  chatId,
  member,
  paramKey,
  paramValue,
}) => {
  const { showSearchPane } = useSearchStore();
  return (
    showSearchPane && (
      <div className="basis-2/5">
        <SearchResults  />
      </div>
    )
  );
};
