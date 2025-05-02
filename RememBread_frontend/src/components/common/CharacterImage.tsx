import DefaultBread from "@/components/svgs/breads/DefaultBread";
import InputBread from "@/components/svgs/breads/InputBread";
import DefaultBreadBlack from "@/components/svgs/breads/DefaultBread";
import InputBreadBlack from "@/components/svgs/breads/InputBread";

interface CharacterImageProps {
  characterId: number;
  className?: string;
  isGrayscale?: boolean;
}

const CharacterImage = ({ characterId, className = "w-60 h-60", isGrayscale = false }: CharacterImageProps) => {
  if (isGrayscale) {
    switch (characterId) {
      case 1:
        return <DefaultBreadBlack className={className} />;
      case 2:
        return <InputBreadBlack className={className} />;
      case 3:
        return <DefaultBreadBlack className={className} />;
      case 4:
        return <DefaultBreadBlack className={className} />;
      default:
        return <DefaultBreadBlack className={className} />;
    }
  }

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