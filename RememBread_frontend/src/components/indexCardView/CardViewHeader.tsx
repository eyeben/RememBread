const CardViewHeader = () => {
  return (
    <div className="flex justify-center items-center w-full h-10 px-4 text-center text-2xl">
      <div className="w-1/2 font-bold text-black hover:cursor-pointer">나의 카드</div>
      <div className="w-1/2 hover:cursor-pointer">카드 둘러보기</div>
    </div>
  );
};

export default CardViewHeader;
