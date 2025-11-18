import { NotificationList } from '../components/notifications/NotificationList';

export const NotificationsPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <NotificationList />
      </div>
    </div>
  );
};
