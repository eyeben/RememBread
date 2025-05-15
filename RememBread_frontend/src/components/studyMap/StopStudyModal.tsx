import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface StopStudyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardSetId: number;
  onConfirm: () => void;
}

const StopStudyModal = ({ open, onOpenChange, cardSetId, onConfirm }: StopStudyModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogContent className="w-[90%] rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg">학습 종료 확인</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="text-center text-sm text-muted-foreground my-4">
            {cardSetId}번 카드셋의 학습을 종료하시겠습니까?
          </div>

          <AlertDialogFooter className="flex justify-between gap-2">
            <AlertDialogCancel className="w-1/2 bg-neutral-300 text-black hover:bg-neutral-400">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="w-1/2 bg-primary-700 text-white hover:bg-primary-800"
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

export default StopStudyModal;
