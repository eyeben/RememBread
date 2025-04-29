import { useNavigate, useLocation } from 'react-router-dom';
import 빵반죽 from '@/assets/footer/빵반죽.png';
import 빵반죽흑백 from '@/assets/footer/빵반죽흑백.png';
import 빵길 from '@/assets/footer/빵길.png';
import 빵길흑백 from '@/assets/footer/빵길흑백.png';
import 오븐 from '@/assets/footer/오븐.png';
import 인덱스카드 from '@/assets/footer/인덱스카드.png';
import 인덱스카드흑백 from '@/assets/footer/인덱스카드흑백.png';
import 기본빵 from '@/assets/footer/기본빵.png';
import 기본빵흑백 from '@/assets/footer/기본빵흑백.png';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <footer className="fixed flex justify-evenly bottom-0 left-0 right-0 w-full max-w-[600px] h-16 mx-auto bg-white pc:border-x border-t border-neutral-200 z-50">
      <div 
        className={`flex-1 flex flex-col items-center justify-center cursor-pointer border-t-4 ${
          isActive('/games') ? 'border-primary-500' : 'border-white'
        }`}
        onClick={() => navigate('/games')}
      >
        <img 
          src={isActive('/games') ? 빵반죽 : 빵반죽흑백} 
          alt="빵반죽" 
          className="w-10 h-10" 
        />
        <span className="text-xxxs">빵반죽</span>
      </div>
      <div 
        className={`flex-1 flex flex-col items-center justify-center cursor-pointer border-t-4 ${
          isActive('/map') ? 'border-primary-500' : 'border-white'
        }`}
        onClick={() => navigate('/map')}
      >
        <img 
          src={isActive('/map') ? 빵길 : 빵길흑백} 
          alt="빵길" 
          className="w-10 h-10" 
        />
        <span className="text-xxxs">빵길</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center -mt-9">
        <div className="relative w-[60px] h-[69px] flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="absolute w-full h-full">
            <path
              d="M 100 20
                 Q 110 20 120 25
                 L 173 55
                 Q 183 60 183 70
                 L 183 130
                 Q 183 140 173 145
                 L 120 175
                 Q 110 180 100 180
                 Q 90 180 80 175
                 L 27 145
                 Q 17 140 17 130
                 L 17 70
                 Q 17 60 27 55
                 L 80 25
                 Q 90 20 100 20"
              fill="#B3915C"
              stroke="#fff"
              strokeWidth="8"
              filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.15)) drop-shadow(0px 6px 4px rgba(0,0,0,0.1))"
            />
          </svg>
          <img 
            src={오븐} 
            alt="오븐" 
            className="w-10 h-10 relative object-contain" 
          />
        </div>
      </div>
      <div 
        className={`flex-1 flex flex-col items-center justify-center cursor-pointer border-t-4 ${
          isActive('/card-view') ? 'border-primary-500' : 'border-white'
        }`}
        onClick={() => navigate('/card-view')}
      >
        <img 
          src={isActive('/card-view') ? 인덱스카드 : 인덱스카드흑백} 
          alt="인덱스카드" 
          className="w-10 h-10" 
        />
        <span className="text-xxxs">인덱스 카드</span>
      </div>
      <div 
        className={`flex-1 flex flex-col items-center justify-center cursor-pointer border-t-4 ${
          isActive('/profile') ? 'border-primary-500' : 'border-white'
        }`}
        onClick={() => navigate('/profile')}
      >
        <img 
          src={isActive('/profile') ? 기본빵 : 기본빵흑백} 
          alt="기본빵" 
          className="w-10 h-10" 
        />
        <span className="text-xxxs">기본빵</span>
      </div>
    </footer>
  );
};

export default Footer;
