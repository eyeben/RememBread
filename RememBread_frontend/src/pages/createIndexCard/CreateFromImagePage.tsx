import { useState, ChangeEvent, KeyboardEvent } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import HashtagInput from "@/components/common/HashtagInput";
import InputBread from "@/components/svgs/InputBread";
import { Input } from "@/components/ui/input";

const CreateFromImagePage = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const selectedFiles: File[] = [];

      Array.from(files).forEach((file) => {
        if (validImageTypes.includes(file.type)) {
          selectedFiles.push(file);
        } else {
          console.error(`"${file.name}" 파일은 이미지 파일이 아닙니다.`);
        }
      });

      if (selectedFiles.length > 0) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
      }
    }
  };

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

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
  };

  return (
    <div
      className="flex flex-col justify-between w-full text-center"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <h1 className="text-primary-500 text-2xl font-bold m-5">사진을 재료로 넣어봐뽱</h1>

      <div className="relative w-full">
        <InputBread className="w-full" />

        <Input
          className="w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer"
          type="file"
          onChange={handleFileChange}
        />
      </div>

      <div className="m-5 gap-2">
        {selectedFiles.length > 0 && (
          <>
            <h2 className="text-lg font-semibold">업로드된 이미지</h2>
            <div className="flex gap-2 flex-wrap justify-between mb-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-gray-100 border rounded flex flex-col items-center mb-4"
                >
                  <div
                    className="relative w-16 h-16 cursor-pointer"
                    onClick={() => handleRemoveFile(file)}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-fill w-16 h-16 rounded"
                    />
                    <X className="absolute top-0 right-0" />
                    <p className="w-16 text-xs text-center overflow-hidden text-ellipsis whitespace-nowrap">
                      {file.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <HashtagInput
              hashtags={hashtags}
              hashtagInput={hashtagInput}
              handleHashtagInputChange={handleHashtagInputChange}
              handleAddHashtag={handleAddHashtag}
              handleRemoveHashtag={handleRemoveHashtag}
              handleHashtagInputKeyDown={handleHashtagInputKeyDown}
            />
          </>
        )}
      </div>

      <Button className="m-5" variant="primary">
        카드 생성하기
      </Button>
    </div>
  );
};

export default CreateFromImagePage;
