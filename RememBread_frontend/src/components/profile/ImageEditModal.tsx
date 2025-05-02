import { useState, useEffect } from "react";
import { getCharacters } from "@/services/userService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CharacterImage from "@/components/common/CharacterImage";
import { Character } from "@/types/profile";

export interface ImageEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (characterId: number) => void;
    currentCharacterId: number;
  } 

const ImageEditModal = ({ isOpen, onClose, onSelect, currentCharacterId }: ImageEditModalProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await getCharacters();
        console.log("캐릭터 목록:", response.result);
        setCharacters(response.result);
      } catch (error) {
        console.error("캐릭터 목록을 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    if (isOpen) {
      fetchCharacters();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-center">캐릭터 선택</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`relative cursor-pointer p-4 ${
                character.isLocked ? "opacity-50" : "hover:bg-neutral-100"
              }`}
              onClick={() => !character.isLocked && onSelect(character.id)}
            >
              <CharacterImage 
                characterId={character.id} 
                className="w-32 h-32 mx-auto" 
                isGrayscale={character.isLocked}
              />
              <div className="text-center mt-2">{character.name}</div>
              {character.isLocked && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <img src="/images/lock.png" alt="잠금" className="w-8 h-8" />
                </div>
              )}
              {character.id === currentCharacterId && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 rounded">
                  선택됨
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditModal; 