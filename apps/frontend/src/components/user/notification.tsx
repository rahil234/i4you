'use client';

import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/store/notification-store';
import { cn } from '@/lib/utils';

export const Notifications = () => {
  const router = useRouter();

  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed z-50 top-4 right-4 left-4 md:left-auto md:w-[350px] w-[90%] mx-auto md:mx-0 space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => {
            if (n.onClick) {
              n.onClick();
            } else if (n.href) {
              router.push(n.href);
            }
            removeNotification(n.id);
          }}
          className={cn(
            'cursor-pointer p-4 rounded-xl shadow-xl text-white transition-all duration-300',
            'hover:opacity-90 flex gap-4 items-start',
          )}
          style={{ backgroundColor: n.color || getColor(n.type) }}
        >
          {n.image && (
            <img src={n.image} alt="icon" className="w-10 h-10 rounded-full object-cover mt-1" />
          )}

          <div className="flex-1">
            {n.title && <div className="font-semibold text-sm">{n.title}</div>}
            <div className="text-sm">{n.content}</div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(n.id);
            }}
            className="text-white text-xl font-bold hover:opacity-70 leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

function getColor(type?: string) {
  return (
    {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#facc15',
      info: '#3b82f6',
    }[type ?? 'info'] ?? '#3b82f6'
  );
}
