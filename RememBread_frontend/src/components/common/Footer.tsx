const Footer = () => {
  return (
    <footer className="fixed flex justify-evenly bottom-0 left-0 right-0 w-full max-w-[600px] h-16 mx-auto bg-white pc:border-x border-t border-neutral-200 z-50">
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src="/footer/빵반죽.png" alt="빵반죽" className="w-10 h-10" />
        <span className="text-xxxs">빵반죽</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src="/footer/빵길.png" alt="빵길" className="w-10 h-10" />
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
            src="/footer/오븐.png" 
            alt="오븐" 
            className="w-10 h-10 relative object-contain" 
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src="/footer/인덱스카드.png" alt="인덱스카드" className="w-10 h-10" />
        <span className="text-xxxs">인덱스 카드</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src="/footer/기본빵.png" alt="기본빵" className="w-10 h-10" />
        <span className="text-xxxs">기본빵</span>
      </div>
    </footer>
  );
};

export default Footer;
