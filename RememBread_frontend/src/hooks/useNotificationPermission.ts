import { useState, useCallback } from 'react';

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const requestPermission = useCallback(async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        console.log('알림 권한이 허용되었습니다.');
        return true;
      } else if (result === 'denied') {
        console.log('알림 권한이 거부되었습니다.');
        return false;
      } else {
        console.log('사용자가 알림 권한을 결정하지 않았습니다.');
        return false;
      }
    } catch (error) {
      console.error('알림 권한 요청 중 오류 발생:', error);
      return false;
    }
  }, []);

  return {
    permission,
    requestPermission
  };
}; 