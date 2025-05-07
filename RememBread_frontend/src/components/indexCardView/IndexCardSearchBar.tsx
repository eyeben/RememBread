import { useState, ChangeEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import OrderSelector from "@/components/indexCardView/OrderSelector";

const IndexCardSearchBar = () => {
  const [query, setQuery] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 25) {
      setQuery(newValue);
    }
  };

  const isLimitExceeded = query.length >= 25;

  return (
    <div className="flex gap-4 h-full">
      <div
        className={`flex items-center border px-4 py-2 w-full gap-2 rounded-md ${
          isLimitExceeded ? "border-negative-500" : "border-neutral-300"
        }`}
      >
        <Search className="w-5 h-full text-neutral-400" />
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="검색어를 입력하세요"
          className="w-full text-sm text-neutral-700 placeholder-gray-400 border-0 shadow-none p-0 h-fit focus-visible:ring-0"
        />
      </div>
      <OrderSelector />
    </div>
  );
};

export default IndexCardSearchBar;
