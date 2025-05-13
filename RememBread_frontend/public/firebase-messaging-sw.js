// 서비스 워커 파일
self.addEventListener("install", function () {
    self.skipWaiting();
  });
  
  self.addEventListener("push", function (e) {
    let data;
    try {
      data = e.data.json();
    } catch (err) {
      console.error("푸시 데이터 JSON 파싱 실패:", err);
      return;
    }
  
    // notification 객체가 없을 때 대비
    const notification = data.notification || data;
    const notificationTitle = notification.title || "알림";
    const notificationOptions = {
      body: notification.body || "",
    };
  
    console.log(notificationTitle, notificationOptions);
  
    e.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  });
  