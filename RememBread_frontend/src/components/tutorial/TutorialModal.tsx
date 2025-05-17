// features/tutorial/TutorialModal.tsx
import { useState } from "react";
import { tutorialPages } from "@/components/tutorial/tutorialData";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal = ({ isOpen, onClose }: Props) => {
  const [page, setPage] = useState(0);
  const current = tutorialPages[page];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-[500px] text-center h-2/3 flex flex-col justify-between">
        {/* 제목 */}
        <h2 className="text-xl font-bold mb-4">{current.title}</h2>

        {/* 미디어 */}
        <div className="mb-4">
          {current.media.endsWith(".mp4") ? (
            <video src={current.media} controls className="mx-auto rounded max-h-[250px]" />
          ) : (
            <img
              src={current.media}
              alt={current.subTitle}
              className="mx-auto rounded max-h-[250px]"
            />
          )}
        </div>

        {/* 설명 */}
        <p className="text-primary-600 text-sm whitespace-pre-line">{current.description}</p>

        {/* 페이지 이동 버튼 */}
        <div className="mt-6">
          <div className="flex justify-around items-center mt-6">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-primary-700 hover:text-primary-500 hover:underline hover:cursor-pointer"
            >
              이전
            </button>
            <span>
              {page + 1} / {tutorialPages.length}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(tutorialPages.length - 1, p + 1))}
              disabled={page === tutorialPages.length - 1}
              className="text-primary-700 hover:text-primary-500 hover:underline hover:cursor-pointer"
            >
              다음
            </button>
          </div>
          <button
            onClick={() => {
              setPage(0); // 페이지 초기화
              onClose();
            }}
            className="mt-4 w-full bg-primary-700 text-white py-2 rounded"
          >
            종료
          </button>
        </div>

        {/* 종료 버튼 */}
      </div>
    </div>
  );
};

export default TutorialModal;
