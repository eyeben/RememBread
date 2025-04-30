import { Tags } from "lucide-react";

const TagRow = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto w-full px-4 py-2 scrollbar-hide">
      <Tags className="min-w-[20px] hover:cursor-pointer" size={18} />
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="bg-primary-700 text-white rounded-full px-3 py-1 text-sm whitespace-nowrap hover:cursor-pointer"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

export default TagRow;
