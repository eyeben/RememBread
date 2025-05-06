import { useEffect, useState, ReactNode } from "react";

interface TimerProps {
  initial: number;
  onEnd?: () => void;
  children?: (value: number) => ReactNode;
}

const Timer = ({ initial, onEnd, children }: TimerProps) => {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    if (value === 0) {
      onEnd && onEnd();
      return;
    }
    const interval = setInterval(() => {
      setValue((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [value, onEnd]);

  return <>{children ? children(value) : value}</>;
};

export default Timer; 