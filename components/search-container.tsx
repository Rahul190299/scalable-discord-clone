'use client'
import { useState } from "react";
import { SearchResults } from "./searchresults";


export  const SearchContainer = () => {
    const [basis,setBasis] = useState('basis-0');
    
    return (
        <div className={`${basis} h-10 w-10 transition-all`}>
         <SearchResults />
      </div>
    ) 
}