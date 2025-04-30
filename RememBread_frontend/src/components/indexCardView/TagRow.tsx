import { ChangeEvent, useState, KeyboardEvent } from "react";
import { Save, Tags } from "lucide-react";

const TagRow = ({ tags }: { tags: string[] }) => {
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [localTags, setLocalTags] = useState<string[]>(tags);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.includes(" ")) return;

    if (newValue.length <= 10) {
      setInputValue(newValue);
    }
  };

  const isLimitExceeded = inputValue.length >= 10;

  const handleAddTag = () => {
    if (!inputValue.trim()) return;
    setLocalTags((prev) => [...prev, inputValue.trim()]);
    setInputValue("");
    setIsInputVisible(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTag();
    } else if (e.key === "Escape") {
      setIsInputVisible(false);
      setInputValue("");
    }
  };
  return (
    <div className="flex-nowrap whitespace-nowrap overflow-x-scroll w-full px-4 py-2 flex items-center gap-2 scrollbar-hide">
      {isInputVisible ? (
        <Save
          className="min-w-[20px] hover:cursor-pointer"
          size={20}
          onClick={() => {
            setIsInputVisible((prev) => !prev);
            handleAddTag();
          }}
        />
      ) : (
        <Tags
          className="min-w-[20px] hover:cursor-pointer"
          size={20}
          onClick={() => setIsInputVisible((prev) => !prev)}
        />
      )}
      {isInputVisible && (
        <input
          type="text"
          className={`max-w-[150px] border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none  ${
            isLimitExceeded
              ? "border-negative-500 focus:ring-2 "
              : "border-gray-300 focus:ring-2 focus:ring-primary-500"
          }`}
          placeholder="태그를 입력해주세요"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}
      {localTags.map((tag, idx) => (
        <span
          key={idx}
          className="bg-primary-700 text-white rounded-full px-3 py-1 text-sm whitespace-nowrap hover:cursor-pointer"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

export default TagRow;
