import { ChangeEvent, useState, KeyboardEvent } from "react";
import { Save, Tags } from "lucide-react";
import { updateCardSet } from "@/services/cardSet"; // PATCH API 함수
import { indexCardSet } from "@/types/indexCard";

interface TagRowProps {
  tags: string[];
  cardSetId: number;
  name?: string;
  isPublic?: number;
}

const TagRow = ({ tags, cardSetId, name = "", isPublic = 1 }: TagRowProps) => {
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [localTags, setLocalTags] = useState<string[]>(tags);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.includes(" ")) return;
    if (newValue.length <= 10) setInputValue(newValue);
  };

  const isLimitExceeded = inputValue.length >= 10;

  const handleAddTag = async () => {
    if (!inputValue.trim()) return;

    const newTags = [...localTags, inputValue.trim()];
    setLocalTags(newTags);
    setInputValue("");
    setIsInputVisible(false);

    try {
      setIsLoading(true);
      await updateCardSet({
        cardSetId,
        name,
        hashTags: newTags,
        isPublic,
      });
    } catch (error) {
      console.error("태그 수정 실패:", error);
      // 실패 시 태그 롤백할 수도 있음
    } finally {
      setIsLoading(false);
    }
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
    <div className="flex-nowrap whitespace-nowrap overflow-x-scroll w-full pc:px-8 px-4 py-1 flex items-center gap-2 scrollbar-hide">
      {isInputVisible ? (
        <Save
          className="min-w-[20px] hover:cursor-pointer text-primary-700"
          size={20}
          onClick={handleAddTag}
        />
      ) : (
        <Tags
          className="min-w-[20px] hover:cursor-pointer text-primary-700"
          size={20}
          onClick={() => setIsInputVisible(true)}
        />
      )}
      {isInputVisible && (
        <input
          type="text"
          className={`max-w-[150px] h-full border rounded-full px-3 py-1 text-sm focus:outline-none ${
            isLimitExceeded
              ? "border-negative-500 focus:ring-2"
              : "border-gray-300 focus:ring-2 focus:ring-primary-500"
          }`}
          placeholder="태그를 입력해주세요"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
      )}
      {localTags.map((tag, idx) => (
        <span
          key={idx}
          className="bg-primary-700 h-full text-white border-primary-700 rounded-full px-3 py-1 text-sm whitespace-nowrap"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

export default TagRow;
