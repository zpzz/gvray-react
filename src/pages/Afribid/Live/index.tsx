import Money from '@/pages/Afribid/components/Money';
import Photo from '@/pages/Afribid/components/Photo';
import { BID_STEP_MULTIPLIERS, vehicleName } from '@/pages/Afribid/constants';
import { findVehicle, VEHICLES } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import { Icon } from '@/layouts/AfribidLayout/IconSprites';
import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history, useParams } from 'umi';

function formatRemain(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const LivePage: React.FC = () => {
  const t = useAfribidT();
  const { id = '' } = useParams<{ id: string }>();
  const store = useAfribidStore();
  const vehicle = findVehicle(id);
  const auction = store.auctions[id];
  const [now, setNow] = useState(Date.now());
  const [stepMul, setStepMul] = useState(1);
  const [custom, setCustom] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (auction?.phase === 'Live' && auction.end <= now) {
      store.finishAuction(id);
    }
  }, [auction, now, id, store]);

  const remain = auction ? auction.end - now : 0;
  const urgent = remain > 0 && remain < 120000;
  const step = vehicle?.step || 10000;
  const nextBid = auction ? auction.price + step * stepMul : 0;

  const queue = useMemo(
    () =>
      VEHICLES.filter(
        (v) =>
          v.mode === 'auction' &&
          v.id !== id &&
          (store.auctions[v.id]?.phase === 'Live' || v.status === 'Upcoming'),
      ).slice(0, 3),
    [id, store.auctions],
  );

  if (!vehicle || !auction) {
    return (
      <div className="container error-page">
        <h1>{t('Auction not available')}</h1>
        <button
          type="button"
          className="btn"
          onClick={() => history.push('/afribid/auctions')}
        >
          {t('Live auctions')}
        </button>
      </div>
    );
  }

  const openConfirm = (amount: number) => {
    setPendingAmount(amount);
    setConfirmOpen(true);
  };

  const placeBid = () => {
    try {
      store.submitBid(id, pendingAmount);
      message.success(t('Bid submitted'));
      setConfirmOpen(false);
    } catch (err) {
      message.error(err instanceof Error ? err.message : String(err));
    }
  };

  const leading = auction.leader === 'You';

  return (
    <div>
      <div className="auction-banner">
        <div className="container">
          <div>
            <div className="eyebrow">{t('LIVE ROOM')}</div>
            <h1>
              {vehicleName(vehicle)} <em className="ltr">{vehicle.id}</em>
            </h1>
            <p>
              {vehicle.city}, {vehicle.country}
            </p>
          </div>
          <div className="auction-stats">
            <div>
              <small>{t('Bids')}</small>
              <b>{auction.bids}</b>
            </div>
            <div>
              <small>{t('Phase')}</small>
              <b>{t(auction.phase)}</b>
            </div>
            <div>
              <small>{t('Connection')}</small>
              <b className="connected">
                <span className="dot" />
                {store.disconnected ? t('Offline') : t('Connected')}
              </b>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="auction-toolbar">
          <div>
            <button
              type="button"
              className="text-link"
              onClick={() => history.push(`/afribid/vehicle/${id}`)}
            >
              <Icon name="arrow" className="back-icon" /> {t('Lot details')}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn outline small"
              onClick={() =>
                auction.phase === 'Paused'
                  ? store.resumeAuction(id)
                  : store.pauseAuction(id)
              }
            >
              {auction.phase === 'Paused' ? t('Resume') : t('Pause')}
            </button>
            <button
              type="button"
              className="btn outline small"
              onClick={() => store.setDisconnected(!store.disconnected)}
            >
              {store.disconnected ? t('Reconnect') : t('Go offline')}
            </button>
          </div>
        </div>

        <div className="live-layout">
          <div>
            <div className="live-vehicle">
              <div className="live-title">
                <div>
                  <div className="eyebrow">{t('Featured lot')}</div>
                  <h2>{vehicleName(vehicle)}</h2>
                  <p>
                    <Icon name="pin" /> {vehicle.city}, {vehicle.country}
                  </p>
                </div>
                <span className={`badge ${auction.phase === 'Live' ? 'red' : 'amber'}`}>
                  {t(auction.phase)}
                </span>
              </div>
              <div className="gallery">
                <Photo name={vehicle.photos[0]} alt={vehicleName(vehicle)} />
              </div>
              <div className="quick-specs">
                {[
                  ['Mileage', `${vehicle.mileage.toLocaleString()} km`],
                  ['Fuel', vehicle.fuel],
                  ['Transmission', vehicle.transmission],
                  ['Drive', vehicle.drive],
                ].map(([label, value]) => (
                  <div key={label}>
                    <Icon name="car" />
                    <div>
                      <small>{t(label)}</small>
                      <b>{t(value)}</b>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="live-lower">
              <div className="panel">
                <div className="panel-head">
                  <h3>{t('Bid history')}</h3>
                </div>
                <table className="data-table history-table">
                  <thead>
                    <tr>
                      <th>{t('Bidder')}</th>
                      <th>{t('Amount')}</th>
                      <th>{t('Time')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auction.history.map((h, i) => (
                      <tr key={`${h.who}-${h.time}-${i}`}>
                        <td>{h.who === 'You' ? t('You') : h.who}</td>
                        <td>
                          <Money cents={h.amount} />
                        </td>
                        <td className="ltr">{h.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="panel">
                <div className="panel-head">
                  <h3>{t('Lot facts')}</h3>
                </div>
                <dl className="live-facts">
                  <div>
                    <dt>{t('Deposit')}</dt>
                    <dd>
                      <Money cents={vehicle.deposit} />
                    </dd>
                  </div>
                  <div>
                    <dt>{t('Increment')}</dt>
                    <dd>
                      <Money cents={vehicle.step} />
                    </dd>
                  </div>
                  <div>
                    <dt>{t('Start price')}</dt>
                    <dd>
                      <Money cents={vehicle.startPrice} />
                    </dd>
                  </div>
                  <div>
                    <dt>{t('VIN')}</dt>
                    <dd className="ltr">{vehicle.vin}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <aside>
            <div className="bid-console">
              <div className="console-top">
                <span>
                  <Icon name="gavel" />
                  {t('Bidding console')}
                </span>
                {auction.extended ? <span>{t('Extended')}</span> : null}
              </div>
              <div className="console-body">
                <div className="price-timer">
                  <div>
                    <small>{t('Current bid')}</small>
                    <div className="price">
                      <Money cents={auction.price} />
                    </div>
                  </div>
                  <div className={`timer${urgent ? ' urgent' : ''}`}>
                    <b className="ltr">{formatRemain(remain)}</b>
                    <small>{t('Left')}</small>
                  </div>
                </div>

                <div
                  className={`bid-status${leading ? ' leading' : auction.mine ? ' outbid' : ''}`}
                >
                  <Icon name={leading ? 'check' : 'info'} />
                  {leading
                    ? t('You are the highest bidder')
                    : auction.mine
                      ? t('You have been outbid')
                      : store.registered.includes(id)
                        ? t('Ready to bid')
                        : t('Register before bidding')}
                </div>

                <div className="bid-options">
                  {BID_STEP_MULTIPLIERS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={stepMul === m ? 'active' : ''}
                      onClick={() => setStepMul(m)}
                    >
                      +{m}×
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn full center"
                  disabled={auction.phase !== 'Live'}
                  onClick={() => openConfirm(nextBid)}
                >
                  {t('Bid')} <Money cents={nextBid} />
                </button>

                <div className="custom-bid">
                  <input
                    value={custom}
                    placeholder={t('Custom amount (USD)')}
                    onChange={(e) => setCustom(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn outline"
                    onClick={() => {
                      const cents = Math.round(Number(custom) * 100);
                      if (!Number.isFinite(cents)) {
                        message.error(t('Enter a valid amount'));
                        return;
                      }
                      openConfirm(cents);
                    }}
                  >
                    {t('Bid')}
                  </button>
                </div>

                <div className="bid-hint">
                  <span>
                    {t('Increment')} <Money cents={step} />
                  </span>
                  <span>{t('Anti-snipe +120s')}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="section">
          <div className="section-head">
            <h2>{t('Up next')}</h2>
          </div>
          <div className="queue">
            {queue.map((v) => (
              <div key={v.id} className="queue-card">
                <Photo name={v.photos[0]} />
                <div>
                  <div className="eyebrow">{v.id}</div>
                  <h3>{vehicleName(v)}</h3>
                  <p>
                    {v.city}, {v.country}
                  </p>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() =>
                      history.push(
                        store.auctions[v.id]
                          ? `/afribid/live/${v.id}`
                          : `/afribid/vehicle/${v.id}`,
                      )
                    }
                  >
                    {t('Open')} <Icon name="arrow" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {confirmOpen ? (
        <dialog open onClose={() => setConfirmOpen(false)}>
          <button
            type="button"
            className="modal-close"
            onClick={() => setConfirmOpen(false)}
          >
            ×
          </button>
          <div className="modal-eyebrow">{t('Confirm bid')}</div>
          <h2>{vehicleName(vehicle)}</h2>
          <div className="modal-amount">
            <Money cents={pendingAmount} />
          </div>
          <p className="modal-copy">
            {t(
              'Your bid follows the published fixed increment. Anti-snipe may extend the timer.',
            )}
          </p>
          <div className="modal-buttons">
            <button type="button" className="btn" onClick={placeBid}>
              {t('Confirm')}
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() => setConfirmOpen(false)}
            >
              {t('Cancel')}
            </button>
          </div>
        </dialog>
      ) : null}
    </div>
  );
};

export default LivePage;
