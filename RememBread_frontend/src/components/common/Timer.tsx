import { useEffect, useState, ReactNode, useRef } from "react";

interface TimerProps {
  initial: number;
  onEnd?: () => void;
  children?: (value: number) => ReactNode;
}

const Timer = ({ initial, onEnd, children }: TimerProps) => {
  const [value, setValue] = useState(initial);
  const intervalRef = useRef<number | undefined>(undefined);
  const onEndRef = useRef(onEnd);

  // onEnd가 변경될 때마다 ref 업데이트
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setValue((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
          }
          onEndRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []); // 컴포넌트 마운트 시에만 실행

  return <>{children ? children(value) : value}</>;
};

export default Timer; 