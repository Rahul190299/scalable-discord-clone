"use client";
import { Input } from "./ui/input";
import { SearchIcon, X } from "lucide-react";
import { useSearchStore } from "@/store/searchstore";

export const SearchMessages = () => {
  const { searchText, setShowSearchPane, setSearchText } = useSearchStore();

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(event.target.value);
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("in enter search");
      // When the user presses Enter, update the state
      if (searchText.trim()) {
        setShowSearchPane(true);
      }
    }
  };
  const clearSearch = () => {
    setSearchText("");
    setShowSearchPane(false);
  };
  return (
    <div className="relative ">
      <Input
        type="text"
        value={searchText}
        className="px-2 !pb-2.5 w-60 block bg-gray-200 border h-8 font-semibold 
        !focus-visible:outline-none  font-sans text-gray-500 text-sm rounded-lg 
        dark:bg-neutral-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white 
        dark:focus:ring-blue-500 placeholder:dark:text-zinc-400"
        placeholder="Search"
        onChange={handleSearchInputChange}
        onKeyDown={handleSearch} // Handle Enter key press
      />
      <div className="absolute inset-y-0 end-4 flex items-center ps-3.5 ">
        {searchText ? (
          <X
            className="w-4 h-4 text-zinc-500 dark:text-zinc-400 cursor-pointer"
            onClick={clearSearch}
          />
        ) : (
          <SearchIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </div>
    </div>
  );
};
