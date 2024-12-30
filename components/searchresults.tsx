"use client";
import { useState } from "react";
import Spinner from "./ui/spinner";
export const SearchResults = () => {
  const [activeButton, setActiveButton] = useState(""); // Track the active button
  const [result, setResults] = useState(0);
  const [loading, setLoading] = useState(true);
  return (
    <div>
      <div className="flex justify-around bg-gray-200">
        <div className="">
          {loading ? (
           
              <Spinner />
            
          ) : (
            <span>{result} Results</span>
          )}
        </div>
        <div className="flex justify-center">
          <button
            className={`px-4 py-2 mx-2 rounded 
                      ${
                        activeButton === "old"
                          ? "bg-blue-500 text-white font-semibold"
                          : "bg-gray-200 text-gray-700"
                      }`}
          >
            New
          </button>
          <button
            className={`px-4 py-2 mx-2 rounded 
            ${
              activeButton === "new"
                ? "bg-blue-500 text-white font-semibold"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Old
          </button>
          {/* <button>Relevant</button> */}
        </div>
      </div>
      <div className=""></div>
    </div>
  );
};
