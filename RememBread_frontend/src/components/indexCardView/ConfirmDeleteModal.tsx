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

interface ConfirmModalProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal = ({ open, message, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(val) => !val && onCancel()}>
      <AlertDialogPortal>
        <AlertDialogContent className="w-[80%] rounded-md ">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">{message}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between pc:gap-2 gap-1">
            <AlertDialogCancel
              className="pc:w-1/2 w-full bg-neutral-300 text-black hover:bg-neutral-400"
              onClick={onCancel}
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              className="pc:w-1/2 w-full bg-negative-500 text-white hover:bg-negative-600"
              onClick={onConfirm}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

export default ConfirmDeleteModal;
