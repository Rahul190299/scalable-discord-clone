import { Input } from "./ui/input";
import { SearchIcon, X } from "lucide-react";
import { useSearchStore } from "@/store/searchstore";

export const SearchMessages = () => {
  const { searchText, setShowSearchPane, setSearchText } = useSearchStore();

  const handleSearchInputChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const clearSearch = () => {
    setSearchText("");
    setShowSearchPane(false);
  };
  return (
    <div className="relative ">
      <Input
        type="text"
        className="!px-2 !pb-2.5 w-44 block bg-gray-200 border h-6 font-normal !focus-visible:outline-none  font-sans text-gray-600 text-sm rounded-sm  block  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search"
        onChange={handleSearchInputChange}
      />
      <div className="absolute inset-y-0 end-4 flex items-center ps-3.5 pointer-events-none">
        {searchText ? (
          <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" onClick={clearSearch} />
        ) : (
          <SearchIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </div>
    </div>
  );
};
