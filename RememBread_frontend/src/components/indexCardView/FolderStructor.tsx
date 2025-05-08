import { getCardSetSimple } from "@/services/cardSet";
import { getFolder, getSubFolder } from "@/services/folder";
import { Folder } from "@/types/folder";
import { indexCardSet } from "@/types/indexCard";
import { FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";
import CreateFolderDialog from "../dialog/CreateFolderDialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const FolderStructor = () => {
  type FolderTreeItem = Folder & {
    children?: FolderTreeItem[];
    isOpen?: boolean;
    parent?: FolderTreeItem;
    cardSets?: indexCardSet[];
  };

  const [folders, setFolders] = useState<FolderTreeItem[]>([]);
  const [folderPath, setFolderPath] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedCardSet, setSelectedCardSet] = useState<indexCardSet | null>(null);

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
    setFolderPath(calculatePath(folder));
  };

  const fetchRootFolders = async () => {
    try {
      const response = await getFolder();
      // 루트 폴더 요청
      const rootFolders = response.result.subFolders;

      // 루트 폴더를 FolderTreeItem 형태로 변환
      setFolders(rootFolders.map((f: Folder) => ({ ...f })));
    } catch (error) {
      console.error("루트 폴더 불러오기 실패:", error);
    }
  };

  const toggleFolder = async (folderId: number) => {
    // 카드셋 초기화
    setSelectedCardSet(null);

    const updateTree = async (nodes: FolderTreeItem[]): Promise<FolderTreeItem[]> => {
      return Promise.all(
        nodes.map(async (node) => {
          if (node.id === folderId) {
            if (node.isOpen) {
              // 접기
              return { ...node, isOpen: false, children: [], cardSets: [] };
            } else {
              // 펼치기: 하위 폴더, 카드셋 API 요청
              try {
                const folderResponse = await getSubFolder(folderId);
                const childrenFolders = folderResponse.result.subFolders;

                const cardSetResponse = await getCardSetSimple(folderId);
                const childerenCardSets = cardSetResponse.result.cardSets;

                return {
                  ...node,
                  isOpen: true,
                  cardSets: childerenCardSets,
                  children: childrenFolders.map((child: Folder) => ({ ...child, parent: node })),
                };
              } catch (error) {
                console.error("하위 폴더 불러오기 실패:", error);
                return node;
              }
            }
          }

          // 자식 노드 재귀
          if (node.children) {
            const updatedChildren = await updateTree(node.children);
            return { ...node, children: updatedChildren };
          }

          return node;
        }),
      );
    };

    const updated = await updateTree(folders);
    setFolders(updated);
  };

  const CreateFolder = async () => {
    if (selectedFolder) {
      const response = await getSubFolder(selectedFolder.id);

      const updatedSubFolders = response.result.subFolders.map((f: Folder) => ({
        ...f,
        parent: selectedFolder,
      }));

      // 폴더 트리 갱신
      const updateFolders = (nodes: FolderTreeItem[]): FolderTreeItem[] => {
        return nodes.map((node) => {
          if (node.id === selectedFolder.id) {
            return { ...node, children: updatedSubFolders };
          }
          if (node.children) {
            return { ...node, children: updateFolders(node.children) };
          }
          return node;
        });
      };

      const updatedFolders = updateFolders(folders);
      setFolders(updatedFolders);
    }
  };

  const calculatePath = (folder: FolderTreeItem | null): string => {
    if (!folder) return "";

    let path = folder.name;
    let currentFolder = folder.parent;

    while (currentFolder) {
      path = currentFolder.name + " > " + path;
      currentFolder = currentFolder.parent;
    }

    return path;
  };

  const renderFolderTree = (nodes: FolderTreeItem[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.id} className="flex flex-col w-full h-full items-center">
        <span
          className="w-full text-left text-xl"
          onClick={() => {
            handleFolderSelect(node);
            toggleFolder(node.id);
          }}
        >
          <span
            className={`flex w-full text-left cursor-pointer ${
              selectedFolder?.id === node.id ? "font-bold" : ""
            }`}
            style={{ paddingLeft: `${depth * 16}px` }}
          >
            {node.isOpen ? "📂" : "📁"} {node.name}
          </span>
          {node.isOpen &&
            node.cardSets?.map((cardSet) => (
              <span
                key={cardSet.cardSetId}
                className={`flex w-full text-left cursor-pointer ${
                  selectedCardSet?.cardSetId === cardSet.cardSetId
                    ? "font-bold text-primary-500"
                    : ""
                }`}
                style={{ paddingLeft: `${(depth + 1) * 16}px` }}
                onClick={(e) => {
                  setSelectedCardSet(cardSet);
                  setFolderPath(calculatePath(node));
                  setSelectedFolder(node);
                  e.stopPropagation();
                }}
              >
                🍞 {cardSet.name}
              </span>
            ))}
        </span>

        {node.isOpen && node.children && renderFolderTree(node.children, depth + 1)}
      </div>
    ));
  };

  useEffect(() => {
    fetchRootFolders();
  }, []);

  type Opt = {
    value: string;
    label?: string;
    depth: number;
    folder?: FolderTreeItem;
    cardSet?: indexCardSet;
  };

  // 트리 구조를 평탄화해서 select 옵션 리스트로 만들어주는 헬퍼
  const getOptions = (): Opt[] => {
    const opts: Opt[] = [];

    const traverse = (nodes: FolderTreeItem[], depth: number = 0) => {
      nodes.forEach((node) => {
        // 폴더 항목
        opts.push({
          value: `folder-${node.id}`,
          label: node.name,
          depth,
          folder: node,
        });

        // 그 폴더 밑 카드셋들
        node.cardSets?.forEach((cs) => {
          opts.push({
            value: `set-${cs.cardSetId}`,
            label: cs.name,
            depth: depth + 1,
            folder: node,
            cardSet: cs,
          });
        });

        // 자식 폴더 재귀
        if (node.children) {
          traverse(node.children, depth + 1);
        }
      });
    };

    traverse(folders, 0);
    return opts;
  };

  const options = getOptions();

  // select에서 값 바뀌었을 때
  const onSelectChange = (val: string) => {
    if (val.startsWith("folder-")) {
      const id = Number(val.split("-")[1]);
      const opt = options.find((o) => o.value === val);
      if (opt?.folder) {
        setSelectedFolder(opt.folder);
        setSelectedCardSet(null);
        setFolderPath(calculatePath(opt.folder));
        toggleFolder(id);
      }
    } else {
      const csId = Number(val.split("-")[1]);
      const opt = options.find((o) => o.value === val);
      if (opt?.cardSet && opt.folder) {
        setSelectedFolder(opt.folder);
        setSelectedCardSet(opt.cardSet);
        setFolderPath(calculatePath(opt.folder));
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* 경로 표시 */}
      <nav className="w-full overflow-x-auto border-b border-gray-200">
        <ul className="flex items-center whitespace-nowrap space-x-1 px-2 py-1">
          {folderPath.split(" > ").map((name, idx, arr) => (
            <li key={idx} className="flex items-center space-x-1">
              <FolderOpen className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{name}</span>
              {idx < arr.length - 1 && <span className="text-gray-400">/</span>}
            </li>
          ))}

          {selectedCardSet && (
            <li className="flex items-center space-x-1">
              <FolderOpen className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-black">{selectedCardSet.name}</span>
            </li>
          )}
        </ul>
      </nav>

      {/* shadcn Select로 트리 대신 선택 UI */}
      <div className="m-5">
        <Select
          value={
            selectedCardSet
              ? `set-${selectedCardSet.cardSetId}`
              : selectedFolder
              ? `folder-${selectedFolder.id}`
              : undefined
          }
          onValueChange={onSelectChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="폴더 또는 카드셋 선택" />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: `${opt.depth * 16}px`,
                  }}
                >
                  {/* depth ≥ 1 이면 앞에 ㄴ 붙이기 */}
                  {opt.depth > 0 && <span className="mr-1 text-gray-400">{`ㄴ`}</span>}
                  <span>{opt.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FolderStructor;
