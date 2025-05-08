import React from 'react';
import '@/styles/effects.css';

interface ImageGeneratorProps {
  src?: string;
  alt?: string;
  blur?: number; // px 단위
  scale?: number; // 배율
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  component?: React.ReactNode; // SVG 컴포넌트 등
  effectType?: number; // 1: 모자이크, 2: 확대
}

const ImageGenerator = ({ 
  src, 
  alt = '', 
  className = '', 
  style = {}, 
  children, 
  component,
  effectType = 1 
}: ImageGeneratorProps) => {
  const getEffectStyle = () => {
    switch (effectType) {
      case 1: // 모자이크
        return {
          filter: 'blur(8px)',
          transform: 'scale(1)',
        };
      case 2: // 확대
        return {
          filter: 'none',
          transform: 'scale(1.5)',
        };
      default:
        return {
          filter: 'none',
          transform: 'scale(1)',
        };
    }
  };

  const effectStyle = getEffectStyle();

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{
        ...effectStyle,
        transition: 'filter 0.3s, transform 0.3s',
        ...style,
      }}
    >
      {/* SVG 또는 일반 이미지 모두 지원 */}
      {component
        ? component
        : src && <img src={src} alt={alt} className="w-full h-full object-cover" />}
      {children}
    </div>
  );
};

export default ImageGenerator; 