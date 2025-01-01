'use client'
import { useState } from "react";
import { SearchResults } from "./searchresults";


export  const SearchContainer = () => {
    const [basis,setBasis] = useState('basis-auto');
    
    return (
        <div className={`${basis}`}>
         <SearchResults />
      </div>
    ) 
}