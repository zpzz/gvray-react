import Money from '@/pages/Afribid/components/Money';
import Photo from '@/pages/Afribid/components/Photo';
import { vehicleName } from '@/pages/Afribid/constants';
import { VEHICLES } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { statusOf, useAfribidStore } from '@/stores/useAfribidStore';
import { Icon } from '@/layouts/AfribidLayout/IconSprites';
import React, { useMemo } from 'react';
import { history } from 'umi';

const AuctionsPage: React.FC = () => {
  const t = useAfribidT();
  const state = useAfribidStore();

  const live = useMemo(
    () =>
      VEHICLES.filter(
        (v) => v.mode === 'auction' && statusOf(v, state) === 'Live',
      ),
    [state],
  );
  const upcoming = useMemo(
    () =>
      VEHICLES.filter(
        (v) => v.mode === 'auction' && statusOf(v, state) === 'Upcoming',
      ),
    [state],
  );

  return (
    <div className="container">
      <div className="breadcrumb">
        <span>{t('Home')}</span>
        <span>/</span>
        <span>{t('Live auctions')}</span>
      </div>
      <div className="page-heading">
        <div>
          <h1>{t('Live auctions')}</h1>
          <p>{t('Join a live room or review upcoming lots.')}</p>
        </div>
        <div className="actions">
          <button
            type="button"
            className="btn outline"
            onClick={() => history.push('/afribid/calendar')}
          >
            {t('Auction calendar')}
          </button>
        </div>
      </div>

      <div className="lobby-grid">
        {live.map((v) => {
          const a = state.auctions[v.id];
          return (
            <article key={v.id} className="lobby-card">
              <Photo name={v.photos[0]} alt={vehicleName(v)} />
              <div className="lobby-copy">
                <span className="badge red">{t('Live')}</span>
                <h2>{vehicleName(v)}</h2>
                <p>
                  {v.city}, {v.country}
                </p>
                <div className="lobby-facts">
                  <div>
                    <small>{t('Current bid')}</small>
                    <b>
                      <Money cents={a?.price ?? v.price} />
                    </b>
                  </div>
                  <div>
                    <small>{t('Bids')}</small>
                    <b>{a?.bids ?? 0}</b>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn"
                  onClick={() => history.push(`/afribid/live/${v.id}`)}
                >
                  {t('Enter live room')} <Icon name="arrow" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="section">
        <div className="section-head">
          <div>
            <h2>{t('Upcoming')}</h2>
            <p>{t('Register early and reserve your deposit.')}</p>
          </div>
        </div>
        {upcoming.map((v) => (
          <div key={v.id} className="schedule-row">
            <div className="date-tile">
              <small>
                {v.starts
                  ? new Date(v.starts).toLocaleString('en', { month: 'short' })
                  : '—'}
              </small>
              <b>
                {v.starts ? new Date(v.starts).getUTCDate() : '—'}
              </b>
            </div>
            <div>
              <h3>{vehicleName(v)}</h3>
              <p>
                {v.city}, {v.country} · <span className="ltr">{v.id}</span>
              </p>
            </div>
            <div className="schedule-time">
              {v.starts
                ? `${new Date(v.starts).toUTCString().slice(17, 22)} UTC`
                : '—'}
              <small>
                {t('Deposit')} <Money cents={v.deposit} />
              </small>
            </div>
            <button
              type="button"
              className="text-link"
              onClick={() => history.push(`/afribid/vehicle/${v.id}`)}
            >
              {t('View lot')} <Icon name="arrow" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionsPage;
