import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import React from 'react';
import { history, useLocation } from 'umi';
import { Icon } from '@/layouts/AfribidLayout/IconSprites';

const NAV = [
  { path: '/afribid/account', label: 'Overview', icon: 'user', exact: true },
  { path: '/afribid/account/profile', label: 'Profile', icon: 'user' },
  {
    path: '/afribid/account/verification',
    label: 'Verification',
    icon: 'shield',
  },
  { path: '/afribid/account/wallet', label: 'Wallet', icon: 'wallet' },
  { path: '/afribid/account/auctions', label: 'My auctions', icon: 'gavel' },
  { path: '/afribid/account/watchlist', label: 'Watchlist', icon: 'heart' },
  { path: '/afribid/account/inquiries', label: 'Inquiries', icon: 'doc' },
  { path: '/afribid/account/orders', label: 'Orders', icon: 'doc' },
  {
    path: '/afribid/account/notifications',
    label: 'Notifications',
    icon: 'bell',
  },
];

interface Props {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const AccountShell: React.FC<Props> = ({
  title,
  subtitle,
  actions,
  children,
}) => {
  const t = useAfribidT();
  const location = useLocation();
  const { session, user, notifications, signOut } = useAfribidStore();
  const unread = notifications.filter((n) => !n.read).length;
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (!session) {
    return (
      <div className="container account-empty-auth">
        <div className="empty">
          <Icon name="user" />
          <h3>{t('Sign in to continue')}</h3>
          <p>{t('Access your deposits, auctions, enquiries and orders.')}</p>
          <button
            type="button"
            className="btn"
            onClick={() => history.push('/afribid/login')}
          >
            {t('Sign in')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container account-layout">
      <aside className="account-sidebar">
        <div className="account-user">
          <span className="avatar">{initials}</span>
          <div>
            <b>{user.name}</b>
            <small>
              {user.id} · {t(user.status)}
            </small>
          </div>
        </div>
        <nav className="account-nav">
          {NAV.map((item) => {
            const active = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                className={active ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  history.push(item.path);
                }}
              >
                <Icon name={item.icon} />
                {t(item.label)}
                {item.path.includes('notifications') && unread > 0 ? (
                  <b>{unread}</b>
                ) : null}
              </a>
            );
          })}
        </nav>
        <div className="account-side-foot">
          <button type="button" onClick={() => signOut()}>
            <Icon name="arrow" className="icon back-icon" />
            {t('Sign out')}
          </button>
        </div>
      </aside>

      <section className="account-main">
        <div className="page-heading">
          <div>
            <h1>{t(title)}</h1>
            {subtitle ? <p>{t(subtitle)}</p> : null}
          </div>
          {actions ? <div className="actions">{actions}</div> : null}
        </div>
        {children}
      </section>
    </div>
  );
};

export default AccountShell;
