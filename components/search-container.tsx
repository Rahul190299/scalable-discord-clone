"use client";
import { useState } from "react";
import { SearchResults } from "./searchresults";
import { useSearchStore } from "@/store/searchstore";

export const SearchContainer = () => {
  const { showSearchPane } = useSearchStore();
  return (
    showSearchPane && (
      <div className="basis-2/5">
        <SearchResults />
      </div>
    )
  );
};
