import { useState } from "react";
import { Search } from "lucide-react";

const IndexCardSearchBar = () => {
  const [query, setQuery] = useState<string>("");

  return (
    <div className="flex items-center border rounded-full px-4 py-2 w-full gap-2">
      <Search className="w-5 h-full text-neutral-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="outline-none w-full text-sm text-netural-700 placeholder-gray-400"
      />
    </div>
  );
};

export default IndexCardSearchBar;
