import { ChangeEvent, useState, KeyboardEvent, useEffect, WheelEvent, useRef } from "react";
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
  const [localTags, setLocalTags] = useState<string[]>(tags);

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || localTags.includes(trimmed)) return;
    const newTags = [...localTags, trimmed];
    setLocalTags(newTags);
    onUpdateTags(newTags);
    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = localTags.filter((tag) => tag !== tagToRemove);
    setLocalTags(newTags);
    onUpdateTags(newTags);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const blockedChars = /[@#!$%*]/;
    if (newValue.includes(" ") || blockedChars.test(newValue)) return;
    if (newValue.length <= 10) setInputValue(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddTag();
    if (e.key === "Escape") setInputValue("");
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="flex items-center w-full px-4 py-1 gap-2 h-10 overflow-hidden">
      {/* 고정 input */}
      <input
        type="text"
        className={`border-2 max-w-[150px] h-8 rounded-full px-3 py-1 text-sm focus:outline-none transition-colors ${
          inputValue.length >= 10
            ? "border-negative-500"
            : "border-primary-500 focus:ring-primary-500"
        } ${isEditing ? "" : "opacity-50 pointer-events-none"}`}
        placeholder="태그를 입력해주세요"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={!isEditing}
      />

      {/* 태그 리스트 */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex-1 min-w-0 flex-nowrap whitespace-nowrap overflow-x-auto scrollbar-hide flex items-center gap-2 h-10"
      >
        {localTags.map((tag) => (
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
          >
            <span>#{tag}</span>
            {isEditing && <X size={12} className="ml-1" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagRow;
