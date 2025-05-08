import { useState, useEffect } from 'react';
import DefaultBread from '@/components/svgs/breads/DefaultBread';
import Bread from '@/components/svgs/game/Bread';
import Bread2 from '@/components/svgs/game/Bread2';
import Baguette from '@/components/svgs/game/Baguette';
import Croissant from '@/components/svgs/game/Croissant';
import styles from '@/styles/gameStyle.module.css';

// 이 페이지는 랜덤 이미지를 반환하는 페이지
const RandomImage = () => {
  const [randomNumber, setRandomNumber] = useState<number>(1);
  const [randomImage, setRandomImage] = useState<React.ReactNode>(<DefaultBread className="w-full h-full" />);
  const [blurValue, setBlurValue] = useState<number>(40);
  const [scaleValue, setScaleValue] = useState<number>(10000);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  // const [transformOrigin, setTransformOrigin] = useState<string>('center center');

  // 초기 설정을 위한 useEffect
  useEffect(() => {
    // 1-2 사이 랜덤 숫자 생성
    const RandomNumber = Math.floor(Math.random() * 2) + 1;
    setRandomNumber(RandomNumber);
    
    // 1-5 사이의 랜덤 숫자 생성
    const RandomImageNumber = Math.floor(Math.random() * 5) + 1;
    
    // 랜덤 이미지 선택
    const images = [
      <DefaultBread className="w-full h-full" />,
      <Bread className="w-full h-full" />,
      <Bread2 className="w-full h-full" />,
      <Baguette className="w-full h-full" />,
      <Croissant className="w-full h-full" />
    ];
    
    // 랜덤 transformOrigin 설정
    // const origins = [
    //   'left top', 'center top', 'right top',
    //   'left center', 'center center', 'right center',
    //   'left bottom', 'center bottom', 'right bottom'
    // ];
    // const randomOrigin = origins[Math.floor(Math.random() * origins.length)];
    // setTransformOrigin(randomOrigin);
    
    setRandomImage(images[RandomImageNumber - 1]);
    setBlurValue(40); // blur 값 초기화
    setScaleValue(10000); // scale 값 초기화
    setTimeLeft(10); // 타이머 초기화
  }, []);

  // 타이머와 blur 효과를 위한 useEffect
  useEffect(() => {
    let timer: number;
    
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        
        if (randomNumber === 1) {
          setBlurValue(prev => Math.max(0, prev - 4));
        } else if (randomNumber === 2) {
          setScaleValue(prev => Math.max(1000, prev - 1000)); // 1초당 10배씩 감소
        }
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [randomNumber, timeLeft]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div 
        className={`w-full h-full flex items-center justify-center ${randomNumber === 1 ? styles.mosaic : ''}`}
        style={randomNumber === 1 
          ? { filter: `blur(${blurValue}px)` }
          : { 
              transform: `scale(${scaleValue / 1000})`,
              transformOrigin: 'center center',
              position: 'relative'
            }
        }
      >
        <div className="w-full h-full" style={{ position: 'relative' }}>
          {randomImage}
        </div>
      </div>
    </div>
  );
};

export default RandomImage;