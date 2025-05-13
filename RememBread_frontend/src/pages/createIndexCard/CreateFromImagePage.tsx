import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import Button from "@/components/common/Button";
import InputBread from "@/components/svgs/breads/InputBread";
import { Input } from "@/components/ui/input";
import { postCardsByImage } from "@/services/card";
import { useToast } from "@/hooks/use-toast";

const CreateFromImagePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
  };
  const handleCreateCard = () => {
    try {
      toast({
        title: "카드를 생성하는 중입니다.",
        description: "카드 생성이 완료되면 알려드릴게요",
      });

      postCardsByImage(selectedFiles)
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
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <h1 className="text-primary-500 text-2xl font-bold m-5">사진을 재료로 넣어봐뽱</h1>

      <div className="flex justify-center relative w-full px-5">
        <InputBread className="w-full h-full max-w-md aspect-square" />

        <Input
          className="w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer"
          type="file"
          onChange={handleFileChange}
        />
      </div>
      {selectedFiles.length > 0 && (
        <div className="m-5 gap-2">
          <>
            <h2 className="text-lg font-semibold">업로드된 이미지</h2>
            <div className="flex gap-2 flex-wrap justify-between mb-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-gray-100 border rounded flex flex-col items-center mb-4"
                >
                  <div className="relative w-16 h-16 cursor-pointer">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-fill w-16 h-16 rounded"
                    />
                    <X className="absolute top-0 right-0" onClick={() => handleRemoveFile(file)} />
                    <p className="w-16 text-xs text-center overflow-hidden text-ellipsis whitespace-nowrap">
                      {file.name}
                    </p>
                  </div>
                </div>
              ))}
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

export default CreateFromImagePage;
