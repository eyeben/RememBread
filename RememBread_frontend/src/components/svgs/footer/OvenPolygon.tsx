import CreateOven from '@/components/svgs/footer/CreateOven';

interface OvenPolygonProps {
  onClick: () => void;
}

const OvenPolygon = ({ onClick }: OvenPolygonProps) => {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center -mt-9 cursor-pointer"
      onClick={onClick}
    >
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
        <CreateOven className="w-10 h-10 relative" />
      </div>
    </div>
  );
};

export default OvenPolygon;
