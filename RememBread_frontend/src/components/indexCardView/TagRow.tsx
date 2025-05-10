import { ChangeEvent, useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagRowProps {
  tags: string[];
  cardSetId: number;
  isEditing: boolean;
  setEditing: (edit: boolean) => void;
  onUpdateTags: (newTags: string[]) => void;
}

const TagRow = ({ tags, isEditing, onUpdateTags }: TagRowProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const blockedChars = /[@#!$%*]/;
    if (newValue.includes(" ") || blockedChars.test(newValue)) return;
    if (newValue.length <= 10) setInputValue(newValue);
  };

  const isLimitExceeded = inputValue.length >= 10;

  const handleAddTag = () => {
    if (!inputValue.trim()) return;
    if (tags.includes(inputValue.trim())) return; // 중복 방지
    const newTags = [...tags, inputValue.trim()];
    onUpdateTags(newTags);
    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    onUpdateTags(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddTag();
    if (e.key === "Escape") setInputValue("");
  };

  return (
    <div className="flex-nowrap whitespace-nowrap overflow-x-scroll w-full px-4 py-1 flex items-center gap-2 scrollbar-hide h-10">
      {/* 입력창 */}
      <input
        type="text"
        className={`border-2 max-w-[150px] h-8 rounded-full px-3 py-1 text-sm focus:outline-none transition-colors ${
          isLimitExceeded ? "border-negative-500" : "border-primary-500 focus:ring-primary-500"
        } ${isEditing ? "" : "opacity-50 pointer-events-none"}`}
        placeholder="태그를 입력해주세요"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={!isEditing}
      />

      {/* 태그 목록 */}
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          disabled={!isEditing}
          onClick={() => handleRemoveTag(tag)}
          className={`flex items-center h-8 rounded-full px-3 py-1 text-sm text-white transition-all duration-200 ${
            isEditing
              ? "bg-primary-700 hover:bg-negative-600"
              : "bg-primary-700 opacity-50 pointer-events-none"
          }`}
          aria-label={`${tag} 태그 삭제`}
        >
          <span>#{tag}</span>
          {isEditing && <X size={12} className="ml-1" />}
        </button>
      ))}
    </div>
  );
};

export default TagRow;
