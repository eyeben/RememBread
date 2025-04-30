import { FolderOpen } from "lucide-react";

const FolderStructor = () => {
  return (
    <div className="flex items-center space-x-1">
      <FolderOpen className="w-5 h-5 text-gray-400 hover:cursor-pointer" />
      <span className="text-sm text-black">메인 / </span>
      <FolderOpen className="w-5 h-5 text-gray-400 hover:cursor-pointer" />
      <span className="text-sm text-black ">공부</span>
    </div>
  );
};

export default FolderStructor;
