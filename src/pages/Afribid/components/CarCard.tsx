import Money from '@/pages/Afribid/components/Money';
import Photo from '@/pages/Afribid/components/Photo';
import { vehicleName } from '@/pages/Afribid/constants';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import type { Vehicle } from '@/pages/Afribid/types';
import {
  amountOf,
  statusOf,
  useAfribidStore,
} from '@/stores/useAfribidStore';
import React from 'react';
import { history } from 'umi';
import { Icon } from '@/layouts/AfribidLayout/IconSprites';

interface Props {
  vehicle: Vehicle;
  ctaLabel?: string;
}

const CarCard: React.FC<Props> = ({ vehicle, ctaLabel }) => {
  const t = useAfribidT();
  const state = useAfribidStore();
  const status = statusOf(vehicle, state);
  const price = amountOf(vehicle, state);
  const saved = state.watchlist.includes(vehicle.id);
  const auction = state.auctions[vehicle.id];

  const href =
    vehicle.mode === 'auction' && status === 'Live'
      ? `/afribid/live/${vehicle.id}`
      : `/afribid/vehicle/${vehicle.id}`;

  const defaultCta =
    vehicle.mode === 'auction'
      ? status === 'Live'
        ? t('Enter live room')
        : t('View lot')
      : price == null
        ? t('Enquire now')
        : t('View vehicle');

  return (
    <article className="car-card">
      <div className="card-image">
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault();
            history.push(href);
          }}
        >
          <Photo name={vehicle.photos[0]} alt={vehicleName(vehicle)} />
        </a>
        <span className={`badge ${status === 'Live' ? 'red' : 'green'}`}>
          {t(status)}
        </span>
        <button
          type="button"
          className={`icon-btn${saved ? ' saved' : ''}`}
          aria-label={t('Watchlist')}
          onClick={() => state.toggleWatchlist(vehicle.id)}
        >
          <Icon name="heart" />
        </button>
      </div>
      <div className="card-body">
        <div className="card-ref">
          <span className="ltr">{vehicle.id}</span>
          <span>
            <Icon name="pin" className="icon" />
            {vehicle.city}
          </span>
        </div>
        <h3>{vehicleName(vehicle)}</h3>
        <div className="spec-line">
          <span>{vehicle.mileage.toLocaleString()} km</span>
          <span>·</span>
          <span>{t(vehicle.fuel)}</span>
          <span>·</span>
          <span>{t(vehicle.transmission)}</span>
        </div>
        <p className="location">
          <Icon name="pin" className="icon" />
          {vehicle.city}, {vehicle.country}
        </p>
        <div className="card-price">
          <div>
            <small>
              {vehicle.mode === 'auction' ? t('Current bid') : t('Price')}
            </small>
            <div className="price">
              <Money cents={price} />
            </div>
          </div>
          {auction?.phase === 'Live' ? (
            <div className="time">{t('Live')}</div>
          ) : vehicle.mode === 'auction' && vehicle.starts ? (
            <div className="time upcoming">
              {new Date(vehicle.starts).toUTCString().slice(0, 22)} UTC
            </div>
          ) : null}
        </div>
        {vehicle.mode === 'auction' && vehicle.deposit ? (
          <div className="deposit-line">
            <Icon name="shield" className="icon" />
            {t('Deposit')} <Money cents={vehicle.deposit} />
          </div>
        ) : null}
        <button
          type="button"
          className="btn full center"
          onClick={() => history.push(href)}
        >
          {ctaLabel || defaultCta}
          <Icon name="arrow" />
        </button>
      </div>
    </article>
  );
};

export default CarCard;
