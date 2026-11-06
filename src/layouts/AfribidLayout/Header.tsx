import { AFRIBID_LOCALES, useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import type { AfribidLang } from '@/pages/Afribid/types';
import { useAfribidStore } from '@/stores';
import React from 'react';
import { history, useLocation } from 'umi';
import { Icon } from './IconSprites';

const NAV = [
  { path: '/afribid/home', label: 'Home' },
  { path: '/afribid/vehicles', label: 'Vehicles' },
  { path: '/afribid/auctions', label: 'Live auctions' },
  { path: '/afribid/calendar', label: 'Auction calendar' },
  { path: '/afribid/how-it-works', label: 'How it works' },
];

const Header: React.FC = () => {
  const t = useAfribidT();
  const location = useLocation();
  const { lang, session, user, notifications, setLang, signOut } =
    useAfribidStore();
  const unread = notifications.filter((n) => !n.read).length;
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="utility">
        <div className="container">
          <span>
            <Icon name="clock" className="icon small" />
            {t('Auction times in UTC')}
          </span>
          <div>
            <a href="#how" onClick={(e) => { e.preventDefault(); history.push('/afribid/how-it-works'); }}>
              {t('New to auctions?')}
            </a>
            <a href="#help" onClick={(e) => { e.preventDefault(); history.push('/afribid/help'); }}>
              {t('Help')}
            </a>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container nav-row">
          <a
            className="brand"
            href="/afribid/home"
            onClick={(e) => {
              e.preventDefault();
              history.push('/afribid/home');
            }}
          >
            <span className="brand-mark">
              A<span>B</span>
            </span>
            <span>
              <strong>
                AFRI<span>BID</span>
              </strong>
              <small>VEHICLE AUCTIONS</small>
            </span>
          </a>

          <nav className="main-nav">
            {NAV.map((item) => {
              const active =
                item.path === '/afribid/home'
                  ? location.pathname === '/afribid/home' ||
                    location.pathname === '/afribid'
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
                  {t(item.label)}
                </a>
              );
            })}
          </nav>

          <div className="nav-tools">
            <label className="language-wrap">
              <select
                className="language-select"
                value={lang}
                aria-label="Language"
                onChange={(e) => setLang(e.target.value as AfribidLang)}
              >
                {AFRIBID_LOCALES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            {session ? (
              <>
                <a
                  className="notification-link"
                  href="/afribid/account/notifications"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/afribid/account/notifications');
                  }}
                >
                  <Icon name="bell" />
                  {unread > 0 ? <b>{unread}</b> : null}
                </a>
                <a
                  className="account-link"
                  href="/afribid/account"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/afribid/account');
                  }}
                >
                  <span className="avatar">{initials}</span>
                  {t('My account')}
                </a>
                <button type="button" className="btn outline small" onClick={() => signOut()}>
                  {t('Sign out')}
                </button>
              </>
            ) : (
              <>
                <a
                  href="/afribid/login"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/afribid/login');
                  }}
                >
                  {t('Sign in')}
                </a>
                <button
                  type="button"
                  className="btn small"
                  onClick={() => history.push('/afribid/register')}
                >
                  {t('Register')}
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
