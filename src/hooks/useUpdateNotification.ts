import { useState, useEffect } from 'react';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

interface UpdateNotificationState {
  isUpdateAvailable: boolean;
  updateApp: () => void;
}

export const useUpdateNotification = (): UpdateNotificationState => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Service Workerの登録と更新チェック
    serviceWorkerRegistration.register({
      onUpdate: (reg) => {
        setIsUpdateAvailable(true);
        setRegistration(reg);
      },
    });

    return () => {
      // コンポーネントのアンマウント時にService Workerを解除
      serviceWorkerRegistration.unregister();
    };
  }, []);

  const updateApp = () => {
    if (registration && registration.waiting) {
      // 待機中のService Workerに更新メッセージを送信
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // 更新後にページをリロード
      window.location.reload();
    }
  };

  return { isUpdateAvailable, updateApp };
};
