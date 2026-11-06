import AccountShell from '@/pages/Afribid/components/AccountShell';
import Money from '@/pages/Afribid/components/Money';
import { vehicleName } from '@/pages/Afribid/constants';
import { findVehicle } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import { Icon } from '@/layouts/AfribidLayout/IconSprites';
import React from 'react';
import { history } from 'umi';

const AccountOverviewPage: React.FC = () => {
  const t = useAfribidT();
  const {
    wallet,
    registered,
    watchlist,
    notifications,
    orders,
    inquiries,
  } = useAfribidStore();

  const liveRegs = registered
    .map((id) => findVehicle(id))
    .filter(Boolean);

  return (
    <AccountShell
      title="My account"
      subtitle="Deposits, live registrations and recent activity."
    >
      <div className="stat-grid">
        <div className="stat-card highlight">
          <small>{t('Available')}</small>
          <div className="stat-number">
            <span>USD</span> <Money cents={wallet.available} showCurrency={false} />
          </div>
          <p>{t('Ready to reserve deposits')}</p>
        </div>
        <div className="stat-card">
          <small>{t('Frozen')}</small>
          <div className="stat-number">
            <span>USD</span> <Money cents={wallet.frozen} showCurrency={false} />
          </div>
          <p>{t('Held for active lots')}</p>
        </div>
        <div className="stat-card">
          <small>{t('Registered lots')}</small>
          <div className="stat-number">{registered.length}</div>
          <p>{t('Live auction places')}</p>
        </div>
        <div className="stat-card">
          <small>{t('Watchlist')}</small>
          <div className="stat-number">{watchlist.length}</div>
          <p>{t('Saved vehicles')}</p>
        </div>
      </div>

      <div className="account-columns">
        <div className="panel">
          <div className="panel-head">
            <h3>{t('Live registrations')}</h3>
            <button
              type="button"
              className="text-link"
              onClick={() => history.push('/afribid/account/auctions')}
            >
              {t('View all')}
            </button>
          </div>
          {liveRegs.length === 0 ? (
            <p className="muted">{t('No active registrations.')}</p>
          ) : (
            liveRegs.map((v) =>
              v ? (
                <div key={v.id} className="activity-item">
                  <div className="activity-icon">
                    <Icon name="gavel" />
                  </div>
                  <div>
                    <b>{vehicleName(v)}</b>
                    <p className="ltr">{v.id}</p>
                  </div>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => history.push(`/afribid/live/${v.id}`)}
                  >
                    {t('Open')}
                  </button>
                </div>
              ) : null,
            )
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>{t('Recent activity')}</h3>
          </div>
          {notifications.slice(0, 4).map((n) => (
            <div key={n.id} className="activity-item">
              <div className="activity-icon">
                <Icon name="bell" />
              </div>
              <div>
                <b>{t(n.title)}</b>
                <p>{t(n.body)}</p>
                <small>{new Date(n.date).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>{t('Shortcuts')}</h3>
        </div>
        <div className="row-actions">
          <button
            type="button"
            className="btn outline"
            onClick={() => history.push('/afribid/account/wallet')}
          >
            {t('Wallet')}
          </button>
          <button
            type="button"
            className="btn outline"
            onClick={() => history.push('/afribid/account/orders')}
          >
            {t('Orders')} ({orders.length})
          </button>
          <button
            type="button"
            className="btn outline"
            onClick={() => history.push('/afribid/account/inquiries')}
          >
            {t('Inquiries')} ({inquiries.length})
          </button>
        </div>
      </div>
    </AccountShell>
  );
};

export default AccountOverviewPage;
