import { create } from 'zustand';

export type Notification = {
  id: string;
  title?: string;
  content: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  image?: string;
  color?: string;
  duration?: number;
  onClick?: () => void;
  href?: string;
};

type NotificationStore = {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  showNotification: (notification) => {
    const id = crypto.randomUUID();
    const { duration = 5000 } = notification;
    const newNotification = { id, ...notification };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, duration);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
