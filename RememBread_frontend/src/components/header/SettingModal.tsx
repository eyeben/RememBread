interface SettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const SettingModal = ({ isOpen, onClose, onLogout }: SettingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative bg-neutral-50 rounded-lg w-[280px] p-4 border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4">설정</h2>
        <button
          onClick={onLogout}
          className="w-full py-2 text-left text-red-500 hover:bg-neutral-100 rounded"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default SettingModal; 