import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
// import pdfWorkerPath from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// GlobalWorkerOptions.workerSrc = pdfWorkerPath;
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

import Button from "@/components/common/Button";
import InputBread from "@/components/svgs/breads/InputBread";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { postCardsByPDF } from "@/services/card";
import { useToast } from "@/hooks/use-toast";

const CreateFromPDFPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageRange, setPageRange] = useState<[number, number]>([0, 0]);

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

  const handleCreateCard = async () => {
    try {
      toast({
        title: "카드를 생성하는 중입니다.",
        description: "카드 생성이 완료되면 알려드릴게요",
      });
      postCardsByPDF(selectedFile!)
        .then(() => {
          toast({
            variant: "success",
            title: "카드 생성 완료",
            description: "카드 생성이 완료됐어요!",
          });
        })
        .catch((error) => {
          console.error("카드 생성 중 오류:", error);
          toast({
            variant: "destructive",
            title: "카드 생성 실패",
            description: "카드 생성중 오류가 발생했어요",
          });
        });
    } catch (error) {
      console.error("카드 생성 중 오류:", error);
    } finally {
      setTimeout(() => {
        navigate("/create");
      }, 1500);
    }
  };

  return (
    <div
      className="flex flex-col justify-between w-full text-center"
      style={{ minHeight: "calc(100vh - 126px)" }}
    >
      <h1 className="text-primary-500 text-2xl font-bold m-5">PDF파일을 재료로 넣어봐뽱</h1>

      <div className="flex justify-center relative w-full px-5">
        {selectedFile && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 text-sm text-neutral-700 font-bold">
            {selectedFile.name}
          </div>
        )}

        <InputBread className="w-full h-full max-w-md aspect-square" />

        <Input
          className="w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer"
          type="file"
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && (
        <div className="m-5 gap-2">
          <>
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
        </div>
      )}

      <Button className="m-5" variant="primary" onClick={handleCreateCard}>
        카드 생성하기
      </Button>
    </div>
  );
};

export default CreateFromPDFPage;
