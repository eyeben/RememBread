import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TestTypeInput = () => {
  return (
    <div className="flex w-full justify-between items-center pc:gap-12 gap-4 mb-6">
      <label htmlFor="problemType" className="pc:text-xl text-md text-primary-600 font-bold">
        문제 유형
      </label>
      <Select defaultValue="blank">
        <SelectTrigger className="flex flex-1 border-primary-700 focus:ring-primary-700 focus:border-primary-700">
          <SelectValue placeholder="Theme" className="data-[state=checked]:text-primary-700 " />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="blank"
            className="data-[state=checked]:text-primary-700 data-[state=checked]:font-semibold"
          >
            빈칸 채우기
          </SelectItem>
          <SelectItem
            value="concept"
            className="data-[state=checked]:text-primary-700 data-[state=checked]:font-semibold"
          >
            개념 맞추기
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TestTypeInput;
