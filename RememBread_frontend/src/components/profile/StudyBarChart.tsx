import { useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 더미 데이터 생성 함수
const getDailyData = () =>
  Array.from({ length: 31 }, (_, i) => ({ day: i + 1, study: Math.floor(Math.random() * 120) }));
const getWeeklyData = () =>
  Array.from({ length: 12 }, (_, i) => ({
    week: `${i + 1}주차`,
    study: Math.floor(Math.random() * 800),
  }));
const getMonthlyData = () =>
  Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}월`,
    study: Math.floor(Math.random() * 2500),
  }));

const StudyBarChart = () => {
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<number>(4);
  const [viewType, setViewType] = useState<"day" | "week" | "month">("day");
  // 일별: 15일 슬라이드, 주별: 12주, 월별: 12달
  const [dayStartIdx, setDayStartIdx] = useState<number>(0); // 일별 슬라이드 인덱스
  const [weekStartIdx, setWeekStartIdx] = useState<number>(0); // 주별 슬라이드 인덱스(3달치 12주)

  // 드래그 상태
  const dragStartX = useRef<number | null>(null);
  const dragging = useRef<boolean>(false);

  // 데이터 준비
  const dailyData = getDailyData(); // 1~31일 더미
  const weeklyData = getWeeklyData(); // 12주 더미
  const monthlyData = getMonthlyData(); // 12달 더미

  // 일별: 15일치만 보여줌
  const visibleDailyData = dailyData.slice(dayStartIdx, dayStartIdx + 15);
  // 주별: 12주(최근 3달치)
  const visibleWeeklyData = weeklyData.slice(weekStartIdx, weekStartIdx + 12);

  // 드래그 이벤트 핸들러 (일별/주별)
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    if ("touches" in e) {
      dragStartX.current = e.touches[0].clientX;
    } else {
      dragStartX.current = e.clientX;
    }
  };
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging.current || dragStartX.current === null) return;
    let clientX;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const diff = clientX - dragStartX.current;
    if (viewType === "day") {
      if (diff > 20 && dayStartIdx > 0) {
        setDayStartIdx(dayStartIdx - 1);
        dragStartX.current = clientX;
      } else if (diff < -20 && dayStartIdx < dailyData.length - 15) {
        setDayStartIdx(dayStartIdx + 1);
        dragStartX.current = clientX;
      }
    } else if (viewType === "week") {
      if (diff > 20 && weekStartIdx > 0) {
        setWeekStartIdx(weekStartIdx - 1);
        dragStartX.current = clientX;
      } else if (diff < -20 && weekStartIdx < weeklyData.length - 12) {
        setWeekStartIdx(weekStartIdx + 1);
        dragStartX.current = clientX;
      }
    }
  };
  const handleDragEnd = () => {
    dragging.current = false;
    dragStartX.current = null;
  };

  // 월/연도 이동 핸들러
  const handleMonthChange = (dir: "prev" | "next") => {
    let newMonth = month + (dir === "prev" ? -1 : 1);
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setYear(newYear);
    setMonth(newMonth);
    setDayStartIdx(0); // 월 바뀌면 일별 인덱스 초기화
    setWeekStartIdx(0); // 월 바뀌면 주별 인덱스 초기화
    // 실제로는 이곳에서 해당 월 데이터를 백엔드에서 받아와야 함
  };
  const handleYearChange = (dir: "prev" | "next") => {
    setYear(dir === "prev" ? year - 1 : year + 1);
    // 실제로는 이곳에서 해당 연도 데이터를 받아와야 함
  };

  // 차트 데이터/축 설정
  // let chartData: any[] = visibleDailyData;
  let chartData: any[] | null = null;
  let xKey = "day";
  let xTickFormatter = (v: any) => `${v}`;
  let tooltipLabelFormatter = (label: any) => `${label}일`;
  if (viewType === "week") {
    chartData = visibleWeeklyData;
    xKey = "week";
    xTickFormatter = (v: any) => `${v}`;
    tooltipLabelFormatter = (label: any) => label;
  } else if (viewType === "month") {
    chartData = monthlyData;
    xKey = "month";
    xTickFormatter = (v: any) => v;
    tooltipLabelFormatter = (label: any) => label;
  }

  return (
    <div className="w-full h-80 bg-white rounded-xl p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">
          공부 기록
          <span className="text-base font-normal text-neutral-400 ml-2 cursor-pointer select-none">
            (예정)
          </span>
          <span className="text-base font-normal text-neutral-400 ml-2 cursor-pointer select-none">
            <Select
              value={viewType}
              onValueChange={(value) => {
                setViewType(value as "day" | "week" | "month");
                setDayStartIdx(0);
                setWeekStartIdx(0);
              }}
            >
              <SelectTrigger className="w-[120px] bg-transparent">
                <SelectValue placeholder="기록 보기" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">일별 기록</SelectItem>
                <SelectItem value="week">주별 기록</SelectItem>
                <SelectItem value="month">월별 기록</SelectItem>
              </SelectContent>
            </Select>
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400 text-base">
          {viewType !== "month" ? (
            <>
              <button onClick={() => handleMonthChange("prev")} className="hover:text-neutral-600">
                &#60;
              </button>
              <span>
                {year}년 {month}월
              </span>
              <button onClick={() => handleMonthChange("next")} className="hover:text-neutral-600">
                &#62;
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleYearChange("prev")} className="hover:text-neutral-600">
                &#60;
              </button>
              <span>{year}년</span>
              <button onClick={() => handleYearChange("next")} className="hover:text-neutral-600">
                &#62;
              </button>
            </>
          )}
        </div>
      </div>
      <div
        className="w-full h-full"
        style={{ touchAction: "pan-y", cursor: viewType !== "month" ? "grab" : "default" }}
        onMouseDown={viewType !== "month" ? handleDragStart : undefined}
        onMouseMove={viewType !== "month" ? handleDragMove : undefined}
        onMouseUp={viewType !== "month" ? handleDragEnd : undefined}
        onMouseLeave={viewType !== "month" ? handleDragEnd : undefined}
        onTouchStart={viewType !== "month" ? handleDragStart : undefined}
        onTouchMove={viewType !== "month" ? handleDragMove : undefined}
        onTouchEnd={viewType !== "month" ? handleDragEnd : undefined}
      >
        {!chartData || chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400 ">
            <div className="text-2xl mb-2">😴</div>
            <div className="text-sm font-medium">아직 기록이 없습니다</div>
            <div className="text-xs mt-1">테스트를 시작하면 여기에 그래프가 표시돼요!</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={xTickFormatter}
              />
              <YAxis tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number) => `${value}분`}
                labelFormatter={tooltipLabelFormatter}
              />
              <Bar dataKey="study" fill="#D2A06E" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default StudyBarChart;
