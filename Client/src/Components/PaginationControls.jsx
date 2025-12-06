import React from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { toast } from "react-toastify";

export function PaginationControls({ currPage, setCurrPage, totalPages = 1, className = "" }) {
  
  const prev = () => {
    if (currPage > 1) setCurrPage(currPage - 1);
    else toast.warn("Invalid Navigation");
  };

  const next = () => {
    if (currPage < totalPages) setCurrPage(currPage + 1);
    else toast.warn("No More Tickets Found");
  };

  return (
    <div className={`p-5 bg-gray-200 mt-10 text-gray-900 rounded-lg ${className}`}>
      <div className="flex items-center justify-center gap-4 font-semibold">

        {/* Previous */}
        <button
          aria-label="Previous page"
          onClick={prev}
          className="bg-gray-900 text-white p-2 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-40"
          disabled={currPage <= 1}
        >
          <MoveLeft className="h-4 w-4" />
        </button>

        {/* Page Info */}
        <span className="text-sm whitespace-nowrap">
          {currPage} / {totalPages}
        </span>

        {/* Next */}
        <button
          aria-label="Next page"
          onClick={next}
          className="bg-gray-900 text-white p-2 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-40"
          disabled={currPage >= totalPages}
        >
          <MoveRight className="h-4 w-4" />
        </button>

      </div>
    </div>
  );
}
