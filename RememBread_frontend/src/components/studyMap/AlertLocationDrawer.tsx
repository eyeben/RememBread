import { KeyboardEvent } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ButtonUI } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/toaster";

interface AlertLocationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onSetCurrentLocation: () => void;
  onSetManualLocation: () => void;
  onSetAddressLocation: () => void;
  onSetPinLocation: () => void;
  isPinMode: boolean;
  setIsPinMode: (val: boolean) => void;
  manualAddress: string;
  setManualAddress: (val: string) => void;
}

const AlertLocationDrawer = ({
  open,
  onOpenChange,
  isEnabled,
  onToggleEnabled,
  onSetAddressLocation,
  manualAddress,
  setManualAddress,
}: AlertLocationDrawerProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSetAddressLocation();
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Toaster />
      <DrawerContent className="pointer-events-none px-4 pb-4 pc:w-[598px] w-full mx-auto">
        <div className="pointer-events-auto flex flex-col items-center justify-center">
          <DrawerHeader className="text-center">
            <DrawerTitle>학습 알림 위치 설정</DrawerTitle>
            <DrawerDescription>원하는 방식을 선택하세요</DrawerDescription>
          </DrawerHeader>

          {/* 알람 스위치 */}
          <div className="flex items-center justify-between w-full px-4 py-2">
            <span className="text-sm font-medium">알림 받기</span>
            <Switch checked={isEnabled} onCheckedChange={onToggleEnabled} />
          </div>

          {/* 위치 설정 버튼 */}
          <div className="flex flex-col gap-2 mt-4 w-full px-4">
            <ButtonUI variant="secondary" onClick={onSetAddressLocation}>
              📫 주소로 알림 위치 설정
            </ButtonUI>

            <div className="flex flex-col gap-2">
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
