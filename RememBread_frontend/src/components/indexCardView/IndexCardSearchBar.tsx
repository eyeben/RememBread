import { Search } from "lucide-react";
import { useState } from "react";

const IndexCardSearchBar = () => {
  const [query, setQuery] = useState<string>("");

  return (
    <div className="flex items-center border rounded-full px-4 py-2 w-full">
      {/* <svg
        className="w-4 h-4 text-gray-400 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"
        />
      </svg> */}
      <Search className="w-5 h-full " />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="outline-none w-full text-sm text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};

export default IndexCardSearchBar;
