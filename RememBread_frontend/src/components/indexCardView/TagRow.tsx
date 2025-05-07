import { ChangeEvent, useState, KeyboardEvent } from "react";
import { Save, Tags } from "lucide-react";
import { updateCardSet } from "@/services/cardSet";

interface TagRowProps {
  tags: string[];
  cardSetId: number;
  isEditing: boolean;
  name?: string;
  isPublic?: number;
  onToggleEditing: () => void;
}

const TagRow = ({ tags, cardSetId, name = "", isPublic = 1, onToggleEditing }: TagRowProps) => {
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [localTags, setLocalTags] = useState<string[]>(tags);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    const blockedChars = /[@#!$%*]/;
    if (newValue.includes(" ")) return;
    if (blockedChars.test(newValue)) return;

    if (newValue.length <= 10) {
      setInputValue(newValue);
    }
  };

  const isLimitExceeded = inputValue.length >= 10;

  const updateTagsOnServer = async (newTags: string[]) => {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!inputValue.trim()) return;

    const newTags = [...localTags, inputValue.trim()];
    setLocalTags(newTags);
    setInputValue("");
    setIsInputVisible(false);

    await updateTagsOnServer(newTags);
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const newTags = localTags.filter((tag) => tag !== tagToRemove);
    setLocalTags(newTags);
    await updateTagsOnServer(newTags);
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
          onClick={async () => {
            if (inputValue.trim()) {
              await handleAddTag();
            } else {
              setIsInputVisible(false);
            }
            onToggleEditing();
          }}
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
          onClick={() => handleRemoveTag(tag)}
          className="bg-primary-700 h-full text-white border-primary-700 rounded-full px-3 py-1 text-sm whitespace-nowrap hover:bg-red-600 hover:line-through hover:cursor-pointer transition-all duration-200"
          title="클릭 시 삭제"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

export default TagRow;
