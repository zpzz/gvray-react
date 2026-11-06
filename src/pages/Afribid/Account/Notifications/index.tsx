import AccountShell from '@/pages/Afribid/components/AccountShell';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import React, { useState } from 'react';
import { history } from 'umi';

const NotificationsPage: React.FC = () => {
  const t = useAfribidT();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAfribidStore();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const list =
    tab === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <AccountShell
      title="Notifications"
      subtitle="Auction, enquiry and settlement updates."
      actions={
        <button
          type="button"
          className="btn outline small"
          onClick={() => markAllNotificationsRead()}
        >
          {t('Mark all read')}
        </button>
      }
    >
      <div className="mini-tabs" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={tab === 'all' ? 'active' : ''}
          onClick={() => setTab('all')}
        >
          {t('All')}
        </button>
        <button
          type="button"
          className={tab === 'unread' ? 'active' : ''}
          onClick={() => setTab('unread')}
        >
          {t('Unread')}
        </button>
      </div>
      <div className="panel p0">
        {list.map((n) => (
          <div
            key={n.id}
            className={`notification-row${n.read ? '' : ' unread'}`}
          >
            <div>
              <h4>{t(n.title)}</h4>
              <p>{t(n.body)}</p>
              <small>{new Date(n.date).toLocaleString()}</small>
            </div>
            <div className="actions">
              {!n.read ? (
                <button
                  type="button"
                  className="btn outline small"
                  onClick={() => markNotificationRead(n.id)}
                >
                  {t('Mark read')}
                </button>
              ) : null}
              <button
                type="button"
                className="btn small"
                onClick={() => {
                  markNotificationRead(n.id);
                  const route = n.route.startsWith('/afribid')
                    ? n.route
                    : `/afribid/${n.route.replace(/^#\/?/, '')}`;
                  history.push(route);
                }}
              >
                {t('Open')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AccountShell>
  );
};

export default NotificationsPage;
