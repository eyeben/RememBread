import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import InputBread from "@/components/svgs/breads/InputBread";

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (characterId: number) => void;
  currentCharacterId: number;
}

const ImageEditModal = ({ isOpen, onClose, onSelect, currentCharacterId }: ImageEditModalProps) => {
  const characters = [
    { id: 1, name: "기본 빵", Component: DefaultBread },
    { id: 2, name: "입력 빵", Component: InputBread },
    { id: 3, name: "기본 빵", Component: DefaultBread },
    { id: 4, name: "기본 빵", Component: DefaultBread },
    { id: 5, name: "기본 빵", Component: DefaultBread },
    // 추가 캐릭터들은 여기에 추가
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">캐릭터 선택</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`cursor-pointer p-2 rounded-lg border-2 ${
                currentCharacterId === character.id
                  ? "border-primary bg-primary/10"
                  : "border-gray-200"
              }`}
              onClick={() => {
                onSelect(character.id);
                onClose();
              }}
            >
              <character.Component className="w-full h-32" />
              <p className="text-center mt-2">{character.name}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditModal; 