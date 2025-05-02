import DefaultBread from "@/components/svgs/breads/DefaultBread";
import InputBread from "@/components/svgs/breads/InputBread";

interface CharacterImageProps {
  characterId: number;
  className?: string;
}

const CharacterImage = ({ characterId, className = "w-60 h-60" }: CharacterImageProps) => {
  switch (characterId) {
    case 1:
      return <DefaultBread className={className} />;
    case 2:
      return <InputBread className={className} />;
    case 3:
      return <DefaultBread className={className} />;
    case 4:
      return <DefaultBread className={className} />;
    default:
      return <DefaultBread className={className} />;
  }
};

export default CharacterImage; 