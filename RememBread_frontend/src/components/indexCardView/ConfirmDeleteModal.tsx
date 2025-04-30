interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal = ({ message, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="w-[600px] h-full bg-black bg-opacity-30 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
          <p className="text-center text-lg font-semibold mb-4">{message}</p>
          <div className="flex justify-between">
            <button
              className="w-[45%] bg-negative-500 text-white rounded px-3 py-2"
              onClick={onConfirm}
            >
              삭제
            </button>
            <button
              className="w-[45%] bg-neutral-300 text-black rounded px-3 py-2"
              onClick={onCancel}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
