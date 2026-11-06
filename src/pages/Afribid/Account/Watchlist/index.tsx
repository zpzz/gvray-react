import AccountShell from '@/pages/Afribid/components/AccountShell';
import CarCard from '@/pages/Afribid/components/CarCard';
import { findVehicle } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import React from 'react';
import { history } from 'umi';

const WatchlistPage: React.FC = () => {
  const t = useAfribidT();
  const watchlist = useAfribidStore((s) => s.watchlist);
  const vehicles = watchlist.map((id) => findVehicle(id)).filter(Boolean);

  return (
    <AccountShell title="Watchlist" subtitle="Saved vehicles.">
      {vehicles.length === 0 ? (
        <div className="empty">
          <h3>{t('No saved vehicles')}</h3>
          <p>{t('Tap the heart on any lot to save it here.')}</p>
          <button
            type="button"
            className="btn"
            onClick={() => history.push('/afribid/vehicles')}
          >
            {t('Browse vehicles')}
          </button>
        </div>
      ) : (
        <div className="cards">
          {vehicles.map((v) => (v ? <CarCard key={v.id} vehicle={v} /> : null))}
        </div>
      )}
    </AccountShell>
  );
};

export default WatchlistPage;
