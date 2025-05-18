import { currentProfilePages } from '@/lib/current-profile-pages';
import { Dispatch, SetStateAction, useState } from 'react';

interface PaginationProps{
    totalPages : number,
    setSelectedPage : Dispatch<SetStateAction<number>>,
    currentSelectedPage : number
}

export const Pagination = (props: PaginationProps)  => {
    
    const getPages = () : (string|number)[] => {
        let pages: (number | string)[] = [];
        pages.push(1);
        if(props.currentSelectedPage < 4){
            pages.push(2,3);
        }
        if (props.currentSelectedPage > 3) pages.push("input-left");
        if(props.currentSelectedPage > props.totalPages-3){
            pages.push(props.totalPages-1,props.totalPages-2);
        }
        if(props.currentSelectedPage < props.totalPages -4){
            pages.push("input-right");
        }
        pages.push(props.totalPages);

        return pages;
    }
    const pages = getPages();

    return (
    <div className="flex items-center gap-2 text-white">
      <button
        onClick={() => onPageChange(props.currentSelectedPage - 1)}
        disabled={props.currentSelectedPage === 1}
        className="px-2 py-1 disabled:opacity-40"
      >
        &lt; Back
      </button>

      {pages.map((item, index) => {
        if (item === "input-left" || item === "input-right") {
          return (
            <input
              key={index}
              type="number"
              placeholder="..."
              min={1}
              max={props.totalPages}
              className="w-12 px-2 py-1 text-center bg-gray-800 border border-gray-600 rounded focus:outline-none"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={handleJumpSubmit}
            />
          );
        }

        return (
          <button
            key={index}
            onClick={() => onPageChange(item)}
            className={`px-3 py-1 rounded-full ${
              item === props.currentSelectedPage ? "bg-indigo-500 text-white" : "hover:bg-gray-700"
            }`}
          >
            {item}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(props.currentSelectedPage + 1)}
        disabled={props.currentSelectedPage === props.totalPages}
        className="px-2 py-1 disabled:opacity-40"
      >
        Next &gt;
      </button>
    </div>
    )
}
