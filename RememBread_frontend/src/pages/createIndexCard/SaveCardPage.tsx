import { useState } from "react";
import Button from "@/components/common/Button";

interface Folder {
  id: number;
  parentFolderId: number | null;
  name: string;
}

const SaveCardPage = () => {
  // 더미 데이터임
  const folderData: Folder[] = [
    { id: 1, parentFolderId: null, name: "루트 폴더" },
    { id: 2, parentFolderId: 1, name: "하위 폴더 1" },
    { id: 3, parentFolderId: 1, name: "하위 폴더 2" },
    { id: 4, parentFolderId: 2, name: "하위 폴더 1-1" },
  ];

  const [selectedFolder, setSelectedFolder] = useState<Folder | null>({
    id: 0,
    parentFolderId: 0,
    name: "새로 만들기",
  });

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
  };

  return (
    <div
      className="flex flex-col justify-between w-full text-center"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <h1 className="text-primary-500 text-2xl font-bold m-5">어디에 저장할 건빵?</h1>

      <div className="m-5">
        <ul className="list-none">
          <li className="py-2">
            <Button
              className={`w-full ${selectedFolder?.id === 0 ? "bg-primary-500 text-white" : ""}`}
              variant="primary-outline"
              onClick={() => handleFolderSelect({ id: 0, parentFolderId: 0, name: "새로 만들기" })}
            >
              새로 만들기
            </Button>
          </li>
          {folderData.map((folder) => (
            <li key={folder.id} className="py-2">
              <Button
                className={`w-full ${
                  selectedFolder?.id === folder.id ? "bg-primary-500 text-white" : ""
                }`}
                variant="primary-outline"
                onClick={() => handleFolderSelect(folder)}
              >
                {folder.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <Button className="m-5" variant="primary">
        저장하기
      </Button>
    </div>
  );
};

export default SaveCardPage;
