import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrderSelector = () => {
  return (
    <Select defaultValue="latest">
      <SelectTrigger className="w-1/8 pc:px-3 px-2 border-primary-700 focus:ring-primary-700 focus:border-primary-700 h-full">
        <SelectValue placeholder="Theme" className="data-[state=checked]:text-primary-700 " />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          value="latest"
          className="data-[state=checked]:text-primary-700 data-[state=checked]:font-semibold"
        >
          최신순
        </SelectItem>
        <SelectItem
          value="popularity"
          className="data-[state=checked]:text-primary-700 data-[state=checked]:font-semibold"
        >
          인기순
        </SelectItem>
        <SelectItem
          value="fork"
          className="data-[state=checked]:text-primary-700 data-[state=checked]:font-semibold"
        >
          포크순
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default OrderSelector;
