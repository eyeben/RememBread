import { useState } from "react";

import Button from "@/components/common/Button";
import HashtagInput from "@/components/common/HashtagInput";

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

const CreateIndexCardSetDialog = () => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState<string>("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary-outline">새로 빵 만들기</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs rounded-lg">
        <DialogHeader>
          <DialogTitle>새로 빵 생성</DialogTitle>
          <DialogDescription>현재 선택된 폴더에 새로 빵을 생성합니다.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span>빵 이름</span>

            <Input id="name" value="새로운 빵" className="col-span-3" />
          </div>
        </div>

        <HashtagInput
          hashtags={hashtags}
          hashtagInput={hashtagInput}
          setHashtags={setHashtags}
          setHashtagInput={setHashtagInput}
        />
        <DialogFooter>
          <Button variant="primary" className="w-full">
            빵 생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIndexCardSetDialog;
