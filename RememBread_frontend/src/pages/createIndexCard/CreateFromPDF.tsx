import { useState, ChangeEvent, KeyboardEvent } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerPath from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerPath;

import Button from "@/components/common/Button";
import HashtagInput from "@/components/common/HashtagInput";
import InputBread from "@/components/svgs/InputBread";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const CreateFromPDF = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageRange, setPageRange] = useState<[number, number]>([0, 0]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);

        const fileReader = new FileReader();

        fileReader.onload = async () => {
          if (fileReader.result) {
            const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);

            try {
              const pdf = await getDocument(typedarray).promise;
              setPageCount(pdf.numPages);
              setPageRange([0, pdf.numPages]);
            } catch (error) {
              console.error("PDF 로딩 실패", error);
            }
          }
        };

        fileReader.readAsArrayBuffer(file);
      } else {
        console.error("PDF 파일만 업로드할 수 있습니다.");
      }
    }
  };

  const handleSliderChange = (value: number[]) => {
    setPageRange([value[0], value[1]]);
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

  return (
    <div
      className="flex flex-col justify-between w-full text-center"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <h1 className="text-primary-500 text-2xl font-bold m-5">PDF파일을 재료로 넣어봐뽱</h1>

      <div className="relative w-full">
        {selectedFile && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 text-sm text-neutral-700 font-bold">
            {selectedFile.name}
          </div>
        )}

        <InputBread className="w-full" />

        <Input
          className="w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer"
          type="file"
          onChange={handleFileChange}
        />
      </div>

      <div className="m-5 gap-2">
        {selectedFile && (
          <>
            <HashtagInput
              hashtags={hashtags}
              hashtagInput={hashtagInput}
              handleHashtagInputChange={handleHashtagInputChange}
              handleAddHashtag={handleAddHashtag}
              handleRemoveHashtag={handleRemoveHashtag}
              handleHashtagInputKeyDown={handleHashtagInputKeyDown}
            />

            <div className="flex flex-col gap-2 text-start">
              <span>페이지 설정 {`${pageRange[0]} - ${pageRange[1]}`}</span>
              <Slider
                defaultValue={[1, pageCount]}
                max={pageCount}
                step={1}
                range={true}
                value={pageRange}
                onValueChange={handleSliderChange}
              />
            </div>
          </>
        )}
      </div>

      <Button className="m-5" variant="primary">
        카드 생성하기
      </Button>
    </div>
  );
};

export default CreateFromPDF;
