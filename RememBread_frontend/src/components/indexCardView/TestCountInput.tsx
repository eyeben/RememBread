import { useState, ChangeEvent } from "react";

const TestCountInput = () => {
  const [inputValue, setInputValue] = useState<string>("1");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const num = Number(inputValue);
    if (!isNaN(num)) {
      const clamped = Math.max(1, Math.min(100, num));
      setInputValue(String(clamped));
    } else {
      setInputValue("1");
    }
  };

  const num = Number(inputValue);
  const isInvalid = (!isNaN(num) && num > 100) || num <= 0;

  return (
    <div className="flex w-full justify-between items-center pc:gap-12 gap-4 mb-6">
      <label htmlFor="problemCount" className="pc:text-xl text-md text-primary-600 font-bold">
        문제 개수
      </label>
      <input
        id="problemCount"
        type="number"
        inputMode="numeric"
        value={inputValue}
        min={1}
        max={100}
        step={1}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`flex flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2
          ${
            isInvalid
              ? "border-negative-500 focus:ring-negative-500"
              : "border-primary-700 focus:ring-primary-700"
          }`}
      />
    </div>
  );
};

export default TestCountInput;
