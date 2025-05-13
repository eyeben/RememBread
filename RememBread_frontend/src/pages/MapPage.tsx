import NotYetBread from "@/components/svgs/breads/NotYetBread";
import MapView from "@/components/studyMap/MapView";

const MapPage = () => {
  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-4">학습 지도</h1> */}
      {/* <div className="bg-white rounded-lg shadow-md p-6">지도 컨텐츠가 들어갈 예정입니다.</div> */}
      {/* <div className="mt-4 flex-1 items-center justify-center">
        <div className="bg-white rounded-lg p-6 text-center text-xl">
          지도 컨텐츠가 들어갈 예정입니다.
        </div>
        <div className="mt-4 flex items-center justify-center">
          <NotYetBread className="h-full" />
        </div>
      </div> */}
      <MapView />
    </div>
  );
};

export default MapPage;
