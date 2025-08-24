import { MoveLeft, Search } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const SearchUser = ({ toggle, setSelectedUserIds, selectedUserIds }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { searchUserProfiles, allUserProfiles, formatDateTime } =
    useContext(TrackForgeContextAPI);
 
  useEffect(() => {
    if (searchTerm !== "") {
      searchUserProfiles(searchTerm, page);
    }
  }, [searchTerm]);

  const toggleUserSelection = (userId) => {
    if (selectedUserIds.includes(userId)) {
      // remove
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      // add
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };


  useEffect(()=>{
    console.log(allUserProfiles);
  },[allUserProfiles])


  return (
    <div className="flex-1 px-3 ">
      
      <div className="flex items-center justify-start gap-5">
       {
        toggle &&
        <MoveLeft
          onClick={() => toggle(false)}
          className="bg-gray-900 text-white rounded p-1 h-8 w-8 cursor-pointer"
        />
      }


        <h1 className="text-center text-2xl">Search Users</h1>
      </div>

      <div className="mt-3 p-3 w-full flex items-center gap-3">
        <label htmlFor="search">
          <Search />
        </label>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          name="search"
          placeholder="Search by username or email..."
          className="outline-none px-4 py-2 bg-gray-100 rounded flex-1 text-gray-900"
        />
      </div>

      <div className="p-3 border mt-5 border-gray-200 rounded w-full h-100 overflow-y-scroll noScroll">
        {searchTerm === "" ? (
          <p className="text-md text-gray-400">Search Results appear here</p>
        ) : allUserProfiles?.length > 0 ? (
          allUserProfiles.map((u, i) => {
            const isSelected = selectedUserIds.includes(u._id);
            return (
              <div
                key={i}
                onClick={() => toggleUserSelection(u._id)}
                className={`text-md flex rounded shadow cursor-pointer flex-wrap items-center justify-between gap-3 px-4 py-1.5 border mb-3 font-medium transition-all
                  ${
                    isSelected
                      ? "bg-green-200 border-green-500"
                      : "hover:shadow-2xl hover:bg-gray-200 text-gray-900 border-gray-300"
                  }`}
              >
                <span>{u.username}</span>
                <span className="text-sm text-gray-400 shrink-0">
                  {formatDateTime(u.createdAt)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-md text-gray-400">
            No Users found for this search!!!
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
