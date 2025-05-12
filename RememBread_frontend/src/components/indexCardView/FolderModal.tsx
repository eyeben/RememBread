import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { getMyFolders } from "@/services/folder";
import { postForkCardSet } from "@/services/cardSet";
import { useToast } from "@/hooks/use-toast";
import { Folder } from "@/types/folder";
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface SelectFolderModalProps {
  open: boolean;
  cardSetId: number;
  onCancel: () => void;
  onSuccess?: () => void;
}

const FolderModal = ({ open, onCancel, cardSetId, onSuccess }: SelectFolderModalProps) => {
  const { toast } = useToast();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      (async () => {
        try {
          const res = await getMyFolders();
          setFolders(res.result?.subFolders ?? []);
        } catch (err) {
          console.error("폴더 목록 불러오기 실패:", err);
        }
      })();
    }
  }, [open]);

  const handleConfirm = async () => {
    if (selectedId == null) return;
    setIsSubmitting(true);
    try {
      await postForkCardSet(cardSetId, { folderId: selectedId });
      toast({
        variant: "success",
        title: "포크 완료",
        description: "카드셋이 성공적으로 복사되었습니다.",
      });
      onSuccess?.();
      onCancel();
    } catch (err) {
      console.error("포크 실패:", err);
      toast({
        variant: "destructive",
        title: "포크 실패",
        description: "카드셋 복사 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => !val && onCancel()}>
      <AlertDialogPortal>
        <AlertDialogContent className="w-[90%] rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg">폴더 선택</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto my-2">
            {folders.length > 0 ? (
              folders.map((folder) => (
                <button
                  key={folder.id}
                  className={`flex justify-between items-center border rounded-md px-4 py-2 text-left transition-colors duration-200 w-full
                        ${
                          selectedId === folder.id
                            ? "border-primary-700 bg-primary-100 text-primary-900 font-semibold"
                            : "border-gray-300 hover:bg-gray-100"
                        }
                    `}
                  onClick={() => {
                    setSelectedId(Number(folder.id));
                  }}
                >
                  <span>{folder.name}</span>
                  {selectedId === folder.id && <Check className="w-5 h-5 text-primary-700" />}
                </button>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">폴더가 없습니다.</p>
            )}
          </div>

          <AlertDialogFooter className="flex justify-between gap-2">
            <AlertDialogCancel
              className="w-1/2 bg-neutral-300 text-black hover:bg-neutral-400"
              onClick={onCancel}
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-1/2 bg-primary-700 text-white hover:bg-primary-800 disabled:opacity-50"
              onClick={handleConfirm}
              disabled={selectedId === null || isSubmitting}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

export default FolderModal;
