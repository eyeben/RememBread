interface SpeechBubbleProps {
  text: string;
  className?: string;
}

const SpeechBubble = ({ text, className }: SpeechBubbleProps) => {
  return (
    <div className={`relative w-fit max-w-[90%] mx-auto mt-8 mb-6 px-8 py-4 bg-primary-200 rounded-xl text-center text-xl font-semibold text-neutral-700 shadow-sm ${className || ''}`}>
      {text}
      <span
        className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-0 h-0 border-x-[16px] border-x-transparent border-t-[16px] border-t-primary-200"
      />
    </div>
  );
};

export default SpeechBubble; 