import Button from "@/components/common/Button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const CreateFolderDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary-outline">새로 폴더 만들기</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs rounded-lg">
        <DialogHeader>
          <DialogTitle>새로 폴더 생성</DialogTitle>
          <DialogDescription>현재 선택된 폴더에 새로 폴더를 생성합니다.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <span className="col-span-2">폴더 이름</span>

            <Input id="name" value="새로운 폴더" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="primary" className="w-full">
            폴더 생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
