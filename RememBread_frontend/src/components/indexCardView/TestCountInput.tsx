import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

const TestCountInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    const num = Number(value);
    if (!isNaN(num)) {
      const clamped = Math.max(1, Math.min(100, num));
      onChange(String(clamped));
    } else {
      onChange("1");
    }
  };

  const num = Number(value);
  const isInvalid = !isNaN(num) && (num > 100 || num <= 0);

  return (
    <div className="flex w-full justify-between items-center pc:gap-12 gap-4 mb-6">
      <label htmlFor="problemCount" className="pc:text-xl text-md text-primary-600 font-bold">
        문제 개수
      </label>
      <Input
        id="problemCount"
        type="number"
        inputMode="numeric"
        value={value}
        min={1}
        max={100}
        step={1}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`flex-1 ${
          isInvalid
            ? "border-negative-500 focus-visible:ring-negative-500"
            : "border-primary-700 focus-visible:ring-primary-700"
        }`}
      />
    </div>
  );
};

export default TestCountInput;
