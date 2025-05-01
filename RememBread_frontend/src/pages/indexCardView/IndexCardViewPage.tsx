import BreadList from "@/components/indexCardView/CardList";
import FolderOrderBar from "@/components/indexCardView/FolderOrderBar";
import IndexCardSearchBar from "@/components/indexCardView/IndexCardSearchBar";

const IndexCardViewPage = () => {
  return (
    <div className="px-3 py-2 pt-2 flex flex-col gap-3">
      <IndexCardSearchBar />
      <FolderOrderBar />
      <BreadList />
    </div>
  );
};

export default IndexCardViewPage;
