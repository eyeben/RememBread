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
    const containerWidth = 384; // sm:w-96
    const containerHeight = 208; // sm:h-52
    const imgSize = 64; // w-16 h-16
    const minSpacing = 48; // 최소 간격
    const padding = 32; // 여백

    setPositions(
      generateBreadPositions(
        breads.length,
        containerWidth,
        containerHeight,
        imgSize,
        minSpacing,
        padding
      )
    );
  }, [breads]);

  const renderBread = (type: string) => {
    switch (type) {
      case 'bread':
        return <Bread className="w-16 h-16" />;
      case 'baguette':
        return <Baguette className="w-16 h-16" />;
      case 'croissant':
        return <Croissant className="w-16 h-16" />;
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
          className="absolute w-16 h-16"
          style={{
            left: `${positions[idx]?.left}px`,
            top: `${positions[idx]?.top}px`
          }}
        >
          {renderBread(bread.type)}
        </div>
      ))}
    </div>
  );
};

export default QuizContainer; 