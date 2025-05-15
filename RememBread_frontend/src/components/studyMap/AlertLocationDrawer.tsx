import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ButtonUI } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AlertLocationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onSetCurrentLocation: () => void;
  onSetAddressLocation: () => void;
  manualAddress: string;
  setManualAddress: (val: string) => void;
}

const AlertLocationDrawer = ({
  open,
  onOpenChange,
  onSetCurrentLocation,
  onSetAddressLocation,
  manualAddress,
  setManualAddress,
}: AlertLocationDrawerProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSetAddressLocation();
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4 pb-4 pc:w-[598px] w-full mx-auto">
        <div className="flex flex-col items-center justify-center">
          <DrawerHeader className="text-center">
            <DrawerTitle>학습 알림 위치 설정</DrawerTitle>
            <DrawerDescription>원하는 방식을 선택하세요</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-3 mt-4 w-full px-4">
            <ButtonUI variant="default" className="w-full" onClick={onSetCurrentLocation}>
              📍 현재 위치로 학습 알림 받기
            </ButtonUI>
            <ButtonUI variant="secondary" onClick={onSetAddressLocation}>
              📫 주소로 알림 위치 설정
            </ButtonUI>
            <div className="flex flex-col gap-2 mt-2">
              <Input
                placeholder="예: 서울특별시 강남구 테헤란로 123"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AlertLocationDrawer;
