import { useNotificationPermission } from '../hooks/useNotificationPermission';
import Button from '@/components/common/Button';

const NotificationPermissionButton = () => {
  const { permission, requestPermission } = useNotificationPermission();

  const handleClick = async () => {
    await requestPermission();
  };

  return (
    <Button 
      onClick={handleClick}
      disabled={permission === 'denied'}
      variant="neutral"
      className="w-full h-10"
    >
      {permission === 'granted' ? '알림 권한 허용됨' : '알림 권한 요청하기'}
    </Button>
  );
}; 

export default NotificationPermissionButton;