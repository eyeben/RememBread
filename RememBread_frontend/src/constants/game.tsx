import Baguette from '@/components/svgs/game/Baguette';
import Croissant from '@/components/svgs/game/Croissant';
import Bread from '@/components/svgs/game/Bread';
import Bread2 from '@/components/svgs/game/Bread2';
import Cake from '@/components/svgs/game/Cake';
import Cookie from '@/components/svgs/game/Cookie';
import Cupcake from '@/components/svgs/game/Cupcake';
import Doughnut from '@/components/svgs/game/Doughnut';
import Pizza from '@/components/svgs/game/Pizza';
import Pretzel from '@/components/svgs/game/Pretzel';

export const BREAD_SVG_LIST = [
  Baguette, Croissant, Bread, Bread2,
  Cake, Cookie, Cupcake, Doughnut,
  Pizza, Pretzel
];

export const renderBread = (type: string) => {
  switch (type) {
    case 'bread':
      return <Bread className="w-16 h-16" />;
    case 'baguette':
      return <Baguette className="w-16 h-16" />;
    case 'croissant':
      return <Croissant className="w-16 h-16" />;
    default:
      return null;
  }
};

 