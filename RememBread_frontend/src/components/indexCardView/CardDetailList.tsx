const messages = new Array(9).fill(
  "페이지 폴트가 발생했을 때 메모리에서 가장 페이지 폴트가 발생했을 때 메모리에서 가장페이지 폴트가 발생했을 때 메모리에서 가장페이지 폴트가 발생했을 때 메모리에서 가장페이지 폴트가 발생했을 때 메모리에서 가장페이지 폴트가 발생했을 때 메모리에서 가장",
);
const highlightIndex = 5;

const CardDetailList = () => {
  return (
    <div className="flex flex-col items-center w-full gap-2 p-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex items-center  gap-2 px-4 py-2 rounded-full w-full text-sm font-medium hover:cursor-pointer
            ${index === highlightIndex ? "bg-primary-700 text-white" : "bg-primary-200"}`}
        >
          <span className="font-bold w-12 truncate overflow-hidden whitespace-nowrap">LRU</span>
          <span className="flex-1 items-center font-bold truncate overflow-hidden whitespace-nowrap">
            {msg}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CardDetailList;
