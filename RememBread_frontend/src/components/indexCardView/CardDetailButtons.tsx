import TestSettingDialog from "@/components/dialog/TestSettingDialog";

interface CardDetailButtonsProps {
  onStudyClick: () => void;
  onTTSClick: () => void;
}

const CardDetailButtons = ({ onStudyClick, onTTSClick }: CardDetailButtonsProps) => {
  return (
    <div className="flex justify-between w-full gap-2 px-4 ">
      <button
        onClick={onStudyClick}
        className="bg-white w-1/3 border-2 border-primary-600 text-primary-600 pc:text-md text-xs py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white"
      >
        학습하기
      </button>
      <button
        disabled
        // onClick={onTTSClick}
        // className="bg-white w-1/3 border-2 border-primary-600 text-primary-600 pc:text-md text-xs py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white"
        className="bg-neutral-200 w-1/3 border-2 pc:text-md text-xs py-2 rounded-full text-neutral-500 cursor-not-allowed"
      >
        TTS 학습하기
      </button>

      <TestSettingDialog />
    </div>
  );
};

export default CardDetailButtons;
