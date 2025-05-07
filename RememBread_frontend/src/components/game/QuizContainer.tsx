import { useEffect, useState } from "react";
import { generateBreadPositions } from "@/utils/breadPositionGenerator";
import Bread from "@/components/svgs/game/Bread";
import Baguette from "@/components/svgs/game/Baguette";
import Croissant from "@/components/svgs/game/Croissant";

interface Bread {
  name: string;
  price: number;
  type: string;
}

interface QuizContainerProps {
  breads: Bread[];
  onClick: () => void;
}

const QuizContainer = ({ breads, onClick }: QuizContainerProps) => {
  const [positions, setPositions] = useState<{left: number; top: number}[]>([]);

  useEffect(() => {
    const imgSize = 48; // w-12 h-12로 줄임
    const containerWidth = 384; // sm:w-96
    const containerHeight = 208 + imgSize / 2; // 하단까지 배치되도록 높이 증가
    const padding = 16; // 여백

    setPositions(
      generateBreadPositions(
        breads.length,
        containerWidth,
        containerHeight,
        imgSize,
        padding
      )
    );
  }, [breads]);

  const renderBread = (type: string) => {
    switch (type) {
      case 'bread':
        return <Bread className="w-12 h-12" />;
      case 'baguette':
        return <Baguette className="w-12 h-12" />;
      case 'croissant':
        return <Croissant className="w-12 h-12" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full sm:w-96 h-44 sm:h-52 flex-shrink-0 bg-neutral-50 rounded-xl border border-neutral-300 relative cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {breads.map((bread, idx) => (
        <div
          key={idx}
          className="absolute w-12 h-12 transition-all duration-200 ease-in-out"
          style={{
            left: `${positions[idx]?.left}px`,
            top: `${positions[idx]?.top}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {renderBread(bread.type)}
        </div>
      ))}
    </div>
  );
};

export default QuizContainer; 