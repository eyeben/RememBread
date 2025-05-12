import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CardSetEditTabsProps {
  isEditing: boolean;
  onToggle: () => void;
}

const CardSetEditTabs = ({ isEditing, onToggle }: CardSetEditTabsProps) => {
  return (
    <Tabs
      className="w-1/8"
      value={isEditing ? "edit" : "view"}
      onValueChange={(val) => {
        if ((val === "edit") !== isEditing) {
          onToggle();
        }
      }}
    >
      <TabsList className="bg-transparent shadow-none border px-0 py-0">
        <TabsTrigger
          value="view"
          className="text-sm data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground"
        >
          보기 모드
        </TabsTrigger>
        <TabsTrigger
          value="edit"
          className="text-sm data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground"
        >
          편집 모드
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CardSetEditTabs;
