import { Eye, Utensils } from "lucide-react";

interface CardStatProps {
  viewCount?: number;
  forkCount?: number;
}

const ViewForkCnt = ({ viewCount, forkCount }: CardStatProps) => {
  return (
    <div className="flex justify-end items-center w-full gap-2">
      <div className="flex justify-end items-center gap-x-0.5">
        <Eye className="w-5" />
        <span className="block pc:text-xl text-sm truncate overflow-hidden whitespace-nowrap">
          {viewCount}
        </span>
      </div>
      <div className="flex justify-end items-center gap-x-0.5">
        <Utensils className="w-5" />
        <span className="block pc:text-xl text-sm truncate overflow-hidden whitespace-nowrap">
          {forkCount}
        </span>
      </div>
    </div>
  );
};

export default ViewForkCnt;
