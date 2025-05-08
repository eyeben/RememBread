import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { getCardSetSimple } from "@/services/cardSet";
import { getFolder, getSubFolder } from "@/services/folder";
import { Folder } from "@/types/folder";
import { indexCardSet } from "@/types/indexCard";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Command, CommandItem, CommandGroup } from "@/components/ui/command";

const FolderStructor = ({ onSelectFolder }: { onSelectFolder: (id: number) => void }) => {
  type FolderTreeItem = Folder & {
    children?: FolderTreeItem[];
    isOpen?: boolean;
    parent?: FolderTreeItem;
    cardSets?: indexCardSet[];
  };

  const [folders, setFolders] = useState<FolderTreeItem[]>([]);
  const [folderPath, setFolderPath] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<FolderTreeItem | null>(null);
  const [selectedCardSet, setSelectedCardSet] = useState<indexCardSet | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectedFolder) {
      console.log("현재 선택된 폴더 ID:", selectedFolder.id);
    }
  }, [selectedFolder]);

  const fetchRootFolders = async () => {
    try {
      const response = await getFolder();
      const rootFolders = response.result.subFolders;
      setFolders(rootFolders.map((f: Folder) => ({ ...f, children: [], cardSets: [] })));
    } catch (error) {
      console.error("루트 폴더 불러오기 실패:", error);
    }
  };

  const toggleFolder = async (folderId: number) => {
    setSelectedCardSet(null);

    const updateTree = async (nodes: FolderTreeItem[]): Promise<FolderTreeItem[]> => {
      return Promise.all(
        nodes.map(async (node) => {
          if (node.id === folderId) {
            if (node.isOpen) {
              return { ...node, isOpen: false, children: [], cardSets: [] };
            } else {
              try {
                const folderResponse = await getSubFolder(folderId);
                const cardSetResponse = await getCardSetSimple(folderId);
                const childrenFolders = folderResponse.result.subFolders;

                return {
                  ...node,
                  isOpen: true,
                  cardSets: cardSetResponse.result.cardSets,
                  children: childrenFolders.map((child: Folder) => ({
                    ...child,
                    parent: node,
                    children: [],
                    cardSets: [],
                  })),
                };
              } catch (error) {
                console.error("하위 폴더 불러오기 실패:", error);
                return node;
              }
            }
          }

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

  const getOptions = (): Opt[] => {
    const opts: Opt[] = [];

    const traverse = (nodes: FolderTreeItem[], depth = 0) => {
      nodes.forEach((node) => {
        opts.push({
          value: `folder-${node.id}`,
          label: node.name,
          depth,
          folder: node,
        });

        node.cardSets?.forEach((cs) => {
          opts.push({
            value: `set-${cs.cardSetId}`,
            label: cs.name,
            depth: depth + 1,
            folder: node,
            cardSet: cs,
          });
        });

        if (node.children) {
          traverse(node.children, depth + 1);
        }
      });
    };

    traverse(folders, 0);
    return opts;
  };

  const options = getOptions();

  const onSelectChange = (val: string) => {
    if (val.startsWith("folder-")) {
      const id = Number(val.split("-")[1]);
      onSelectFolder(id);
      const opt = options.find((o) => o.value === val);
      if (opt?.folder) {
        setSelectedFolder(opt.folder);
        setSelectedCardSet(null);
        setFolderPath(calculatePath(opt.folder));
        toggleFolder(id);
      }
    } else {
      const opt = options.find((o) => o.value === val);
      if (opt?.cardSet && opt.folder) {
        onSelectFolder(opt.folder.id);
        setSelectedFolder(opt.folder);
        setSelectedCardSet(opt.cardSet);
        setFolderPath(calculatePath(opt.folder));
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button className="h-8 w-full text-left border-b border-gray-200 py-1 cursor-pointer">
            <ul className="flex items-center whitespace-nowrap space-x-1 h-full">
              {folderPath || selectedCardSet ? (
                [...folderPath.split(" > "), selectedCardSet?.name]
                  .filter(Boolean)
                  .map((name, idx, arr) => {
                    const isLast = idx === arr.length - 1;
                    return (
                      <li key={idx} className="flex items-center space-x-1">
                        <FolderOpen className="w-4 h-4 text-gray-400" />
                        <span
                          className={`text-sm ${isLast ? "text-primary-700" : "text-gray-600"}`}
                        >
                          {name}
                        </span>
                        {idx < arr.length - 1 && <span className="text-gray-400">{">"}</span>}
                      </li>
                    );
                  })
              ) : (
                <li className="flex items-center space-x-1 text-gray-400">
                  <FolderOpen className="w-4 h-4 text-gray-300" />
                  <span className="text-sm italic">폴더를 선택해주세요</span>
                </li>
              )}
            </ul>
          </button>
        </DrawerTrigger>

        <DrawerContent
          className="w-full max-w-[590px] mx-auto px-4 pb-6 shadow-lg border-t border-gray-200"
          style={{
            maxHeight: "600px",
            backgroundColor: "white",
            overflow: "hidden", // DrawerContent 자체에는 스크롤 없음
          }}
        >
          <div className="overflow-y-auto max-h-[calc(80vh-48px)]">
            <Command>
              <CommandGroup heading="폴더">
                {options.map((opt) => {
                  const selectedValue = selectedCardSet
                    ? `set-${selectedCardSet.cardSetId}`
                    : selectedFolder
                    ? `folder-${selectedFolder.id}`
                    : null;

                  const isSelected = opt.value === selectedValue;

                  return (
                    <CommandItem
                      key={opt.value}
                      onSelect={() => onSelectChange(opt.value)}
                      className="!font-normal !text-black hover:cursor-pointer"
                    >
                      <div
                        className="flex items-center"
                        style={{ paddingLeft: `${opt.depth * 16}px` }}
                      >
                        {opt.depth > 0 && <span className="mr-1 text-gray-400">ㄴ</span>}
                        <span className={isSelected ? "text-primary-700" : "text-black"}>
                          {opt.label}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FolderStructor;
