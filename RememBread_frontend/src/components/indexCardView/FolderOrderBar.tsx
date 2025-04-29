import FolderStructor from "@/components/indexCardView/FolderStructor";
import OrderSelector from "@/components/indexCardView/OrderSelector";

const FolderOrderBar = () => {
  return (
    <div className="flex justify-between items-center w-full px-3 h-10">
      <FolderStructor />
      <OrderSelector />
    </div>
  );
};

export default FolderOrderBar;
