interface CardDetailButtonsProps {
  onStudyClick: () => void;
  onTTSClick: () => void;
  onTestClick: () => void;
}

const CardDetailButtons = ({ onStudyClick, onTTSClick, onTestClick }: CardDetailButtonsProps) => {
  return (
    <div className="flex justify-between w-full gap-2 px-4 ">
      <button
        onClick={onStudyClick}
        className="w-1/3 border-2 border-primary-600 text-primary-600 pc:text-md text-xs py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white"
      >
        학습하기
      </button>
      <button
        onClick={onTTSClick}
        className="w-1/3 border-2 border-primary-600 text-primary-600 pc:text-md text-xs py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white"
      >
        TTS 학습하기
      </button>
      <button
        onClick={onTestClick}
        className="w-1/3 border-2 border-primary-600 text-primary-600 pc:text-md text-xs py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white"
      >
        테스트하기
      </button>
    </div>
  );
};

export default CardDetailButtons;
