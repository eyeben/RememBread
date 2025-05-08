import ImageGenerator from './ImageGenerator';
import DefaultBread from '@/components/svgs/breads/DefaultBread';
import { useState, useEffect } from 'react';

// 이 페이지는 랜덤 이미지를 반환하는 페이지
const RandomImage = () => {
  const [randomNumber, setRandomNumber] = useState<number>(1);
  const [randomImage, setRandomImage] = useState<React.ReactNode>(<DefaultBread />);

  useEffect(() => {
    // 1-2 사이의 랜덤 숫자 생성
    const newRandomNumber = Math.floor(Math.random() * 2) + 1;
    setRandomNumber(newRandomNumber);
    
    // TODO: 실제 랜덤 이미지 로직 구현 필요
    setRandomImage(<DefaultBread />);
  }, []);

  return (
    <div className="w-full h-[470px]">
      <ImageGenerator 
        component={randomImage} 
        effectType={randomNumber}
      />
    </div>
  );
};

export default RandomImage; 