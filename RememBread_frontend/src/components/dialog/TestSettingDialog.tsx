import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Button from "@/components/common/Button";

interface TestSettingDialogProps {
  indexCardId: number;
}

const TestSettingDialog = ({ indexCardId }: TestSettingDialogProps) => {
  const navigate = useNavigate();

  const [count, setCount] = useState([100]);
  const [selectedMode, setSelectedMode] = useState<string>("CONCEPT");

  const handleStartTest = () => {
    if (selectedMode === "CONCEPT") {
      navigate(`/test/${indexCardId}/concept`);
    } else if (selectedMode === "EXPLANE") {
      navigate(`/test/${indexCardId}/explane`);
    }
  };

  return (
    <Dialog aaria-hidden="false">
      <DialogTrigger asChild>
        <Button className="w-full" variant="primary-outline">
          테스트하기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs rounded-lg">
        <DialogHeader>
          <DialogTitle>테스트설정</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 text-start my-2">
          <span>최대 문제 수: {count[0]} 문제</span>
          <Slider value={count} onValueChange={setCount} max={100} step={1} />
        </div>

        <div className="flex flex-col gap-2 text-start my-2">
          <span>문제 유형</span>
          <RadioGroup value={selectedMode} onValueChange={setSelectedMode}>
            <div className="flex justify-between space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CONCEPT" id="concept" />
                <Label htmlFor="concept">개념 맞히기</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EXPLANE" id="explane" />
                <Label htmlFor="explane">설명 해보기</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <DialogClose>
            <div
              className="flex justify-center items-center text-sm font-bold rounded-lg transition-colors ease-in-out w-full px-4 h-9 bg-primary-500 hover:bg-primary-400 text-white"
              onClick={handleStartTest}
            >
              테스트 시작하기
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestSettingDialog;
