import { useState, ChangeEvent, KeyboardEvent } from "react";
import Button from "@/components/common/Button";
import HashtagInput from "@/components/common/HashtagInput";
import InputBread from "@/components/svgs/InputBread";

const CreateFromText = () => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");

  const handleHashtagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHashtagInput(event.target.value);
  };

  const handleAddHashtag = () => {
    if (hashtagInput.trim() !== "" && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput("");
    }
  };

  const handleRemoveHashtag = (hashtag: string) => {
    setHashtags(hashtags.filter((tag) => tag !== hashtag));
  };

  const handleHashtagInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddHashtag();
    }
  };

  return (
    <div
      className="flex flex-col justify-between w-full text-center"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <h1 className="text-primary-500 text-2xl font-bold m-5">텍스트를 재료로 넣어봐뽱</h1>

      <div className="relative w-full">
        <textarea
          className="absolute top-1/4 left-1/3 w-1/3 h-1/2 bg-inherit border-none outline-none focus:ring-0 shadow-none resize-none font-bold"
          value={inputText}
          placeholder="여기에 텍스트를 입력하세요"
          onChange={(e) => setInputText(e.target.value)}
          style={{
            scrollbarWidth: "none",
          }}
        />

        <InputBread className="w-full" />
      </div>

      <div className="m-5 gap-2">
        <HashtagInput
          hashtags={hashtags}
          hashtagInput={hashtagInput}
          handleHashtagInputChange={handleHashtagInputChange}
          handleAddHashtag={handleAddHashtag}
          handleRemoveHashtag={handleRemoveHashtag}
          handleHashtagInputKeyDown={handleHashtagInputKeyDown}
        />
      </div>

      <Button className="m-5" variant="primary">
        카드 생성하기
      </Button>
    </div>
  );
};

export default CreateFromText;
