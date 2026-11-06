import GalleryMagnifier from '@/pages/Afribid/components/GalleryMagnifier';
import Money from '@/pages/Afribid/components/Money';
import Photo from '@/pages/Afribid/components/Photo';
import { COUNTRIES, vehicleName } from '@/pages/Afribid/constants';
import { findVehicle } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import {
  amountOf,
  statusOf,
  useAfribidStore,
} from '@/stores/useAfribidStore';
import { Icon } from '@/layouts/AfribidLayout/IconSprites';
import { message } from 'antd';
import React, { useMemo, useState } from 'react';
import { history, useParams } from 'umi';

const VehicleDetailPage: React.FC = () => {
  const t = useAfribidT();
  const { id = '' } = useParams<{ id: string }>();
  const store = useAfribidStore();
  const vehicle = findVehicle(id);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [destination, setDestination] = useState('Kenya');
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryType, setEnquiryType] = useState<'Inquiry' | 'Purchase intent'>(
    'Inquiry',
  );
  const [enquiryForm, setEnquiryForm] = useState({
    message: '',
    country: 'Kenya',
    location: '',
    amount: '',
    paymentDate: '',
  });

  const status = vehicle ? statusOf(vehicle, store) : '';
  const price = vehicle ? amountOf(vehicle, store) : null;
  const registered = store.registered.includes(id);
  const saved = store.watchlist.includes(id);

  const photos = useMemo(() => vehicle?.photos || [], [vehicle]);

  if (!vehicle) {
    return (
      <div className="container error-page">
        <div className="error-code">404</div>
        <h1>{t('Vehicle not found')}</h1>
        <button
          type="button"
          className="btn"
          onClick={() => history.push('/afribid/vehicles')}
        >
          {t('Browse vehicles')}
        </button>
      </div>
    );
  }

  const handleRegister = () => {
    try {
      store.registerVehicle(id, destination);
      message.success(t('Your auction place is reserved'));
    } catch (err) {
      message.error(err instanceof Error ? err.message : String(err));
    }
  };

  const handleEnquiry = () => {
    try {
      const result = store.createEnquiry(id, enquiryType, {
        message: enquiryForm.message,
        country: enquiryForm.country,
        location: enquiryForm.location,
        amount: enquiryForm.amount
          ? Math.round(Number(enquiryForm.amount) * 100)
          : undefined,
        paymentDate: enquiryForm.paymentDate,
      });
      const q = result.created || result.existing;
      setEnquiryOpen(false);
      if (q) history.push(`/afribid/inquiry/${q.id}`);
    } catch (err) {
      message.error(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="container">
      <div className="breadcrumb">
        <a
          href="/afribid/vehicles"
          onClick={(e) => {
            e.preventDefault();
            history.push('/afribid/vehicles');
          }}
        >
          {t('Vehicles')}
        </a>
        <span>/</span>
        <span className="ltr">{vehicle.id}</span>
      </div>

      <div className="detail-heading">
        <div className="page-heading">
          <div>
            <div className="eyebrow">
              <span className="ltr">{vehicle.id}</span>
              <span className={`badge ${status === 'Live' ? 'red' : 'green'}`}>
                {t(status)}
              </span>
            </div>
            <h1>{vehicleName(vehicle)}</h1>
            <div className="meta">
              <Icon name="pin" />
              {vehicle.city}, {vehicle.country}
              <span>·</span>
              <span className="ltr">{vehicle.vin}</span>
            </div>
          </div>
          <div className="actions">
            <button
              type="button"
              className={`icon-btn${saved ? ' saved' : ''}`}
              onClick={() => store.toggleWatchlist(id)}
            >
              <Icon name="heart" />
            </button>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <div className="gallery">
            <GalleryMagnifier
              name={photos[photoIndex] || photos[0]}
              alt={vehicleName(vehicle)}
            />
            <div className="photo-badges">
              <span className="badge dark">{t(vehicle.mode === 'auction' ? 'Auction' : 'Direct sale')}</span>
            </div>
            <div className="gallery-bottom">
              <span className="gallery-counter">
                {photoIndex + 1} / {photos.length}
              </span>
              <div className="gallery-controls">
                <button
                  type="button"
                  onClick={() =>
                    setPhotoIndex(
                      (i) => (i - 1 + photos.length) % photos.length,
                    )
                  }
                >
                  <Icon name="arrow" className="back-icon" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPhotoIndex((i) => (i + 1) % photos.length)
                  }
                >
                  <Icon name="arrow" />
                </button>
              </div>
            </div>
          </div>
          <div className="thumbs">
            {photos.map((p, i) => (
              <button
                key={p + i}
                type="button"
                className={`thumb${i === photoIndex ? ' active' : ''}`}
                onClick={() => setPhotoIndex(i)}
              >
                <Photo name={p} />
              </button>
            ))}
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

          <section className="detail-section" id="overview">
            <div className="section-head">
              <h2>{t('Overview')}</h2>
            </div>
            <p className="body-copy">
              {t(
                'Review the published specifications, condition notes and documents before you bid or enquire.',
              )}
            </p>
            <dl className="spec-table">
              {[
                ['Year', String(vehicle.year)],
                ['Make', vehicle.make],
                ['Model', vehicle.model],
                ['Body', vehicle.body],
                ['Colour', vehicle.colour],
                ['Seats', String(vehicle.seats)],
                ['Steering', vehicle.steering],
                ['Engine', vehicle.engine],
                ['First registration', vehicle.firstRegistration],
                ['VIN', vehicle.vin],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{t(k)}</dt>
                  <dd className={k === 'VIN' ? 'ltr' : ''}>{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="detail-section">
            <div className="section-head">
              <h2>{t('Condition')}</h2>
            </div>
            <div className="condition-grid">
              <div>
                <small>{t('Exterior')}</small>
                <b>
                  <Icon name="check" /> {t(vehicle.condition)}
                </b>
              </div>
              <div>
                <small>{t('Interior')}</small>
                <b>
                  <Icon name="check" /> {t('Normal wear')}
                </b>
              </div>
              <div>
                <small>{t('Mechanical')}</small>
                <b>
                  <Icon name="check" /> {t('Roadworthy')}
                </b>
              </div>
            </div>
          </section>
        </div>

        <aside className="sticky-card">
          <div className="buy-card">
            <div className="buy-card-top">
              <span>{t(vehicle.mode === 'auction' ? 'Auction lot' : 'Direct sale')}</span>
              <small className="ltr">{vehicle.id}</small>
            </div>
            <div className="buy-body">
              <div className="price-label">
                {vehicle.mode === 'auction' ? t('Current bid') : t('Price')}
              </div>
              <div className="price">
                <Money cents={price} />
              </div>

              {vehicle.mode === 'auction' ? (
                <>
                  <div className="buy-meta">
                    <span>
                      {t('Deposit')} <Money cents={vehicle.deposit} />
                    </span>
                    <span>
                      {t('Step')} <Money cents={vehicle.step} />
                    </span>
                  </div>
                  {status === 'Live' ? (
                    <button
                      type="button"
                      className="btn full center dark"
                      onClick={() => history.push(`/afribid/live/${id}`)}
                    >
                      {t('Enter live room')} <Icon name="arrow" />
                    </button>
                  ) : null}
                  {!registered ? (
                    <>
                      <label className="field">
                        <span>{t('Sale destination')}</span>
                        <select
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                        >
                          {vehicle.saleCountries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        className="btn full center"
                        onClick={handleRegister}
                      >
                        {t('Register to bid')}
                      </button>
                    </>
                  ) : (
                    <div className="notice">
                      <Icon name="check" />
                      {t('You are registered for this lot.')}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn full center"
                    onClick={() => {
                      setEnquiryType(
                        price == null ? 'Inquiry' : 'Purchase intent',
                      );
                      setEnquiryOpen(true);
                    }}
                  >
                    {price == null ? t('Enquire now') : t('Submit purchase intent')}
                  </button>
                  <button
                    type="button"
                    className="btn outline full center"
                    onClick={() => {
                      setEnquiryType('Inquiry');
                      setEnquiryOpen(true);
                    }}
                  >
                    {t('Ask a question')}
                  </button>
                </>
              )}

              <div className="readiness">
                <Icon name="shield" />
                <div>
                  {t('Verified buyers only')}
                  <small>{t('Bank transfer deposits')}</small>
                </div>
              </div>
            </div>
            <div className="card-foot">
              <Icon name="info" />
              {t('All amounts shown in USD. DEMO ONLY.')}
            </div>
          </div>
        </aside>
      </div>

      {enquiryOpen ? (
        <dialog open className="wide-modal" onClose={() => setEnquiryOpen(false)}>
          <button
            type="button"
            className="modal-close"
            onClick={() => setEnquiryOpen(false)}
          >
            ×
          </button>
          <div className="modal-eyebrow">{t(enquiryType)}</div>
          <h2>{vehicleName(vehicle)}</h2>
          <div className="form-grid" style={{ marginTop: 20 }}>
            <label className="field wide">
              <span>{t('Message')}</span>
              <textarea
                value={enquiryForm.message}
                onChange={(e) =>
                  setEnquiryForm((f) => ({ ...f, message: e.target.value }))
                }
                rows={4}
              />
            </label>
            <label className="field">
              <span>{t('Country')}</span>
              <select
                value={enquiryForm.country}
                onChange={(e) =>
                  setEnquiryForm((f) => ({ ...f, country: e.target.value }))
                }
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{t('Location')}</span>
              <input
                value={enquiryForm.location}
                onChange={(e) =>
                  setEnquiryForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </label>
            {enquiryType === 'Purchase intent' ? (
              <>
                <label className="field">
                  <span>{t('Intent price (USD)')}</span>
                  <input
                    value={enquiryForm.amount}
                    onChange={(e) =>
                      setEnquiryForm((f) => ({ ...f, amount: e.target.value }))
                    }
                  />
                </label>
                <label className="field">
                  <span>{t('Expected payment date')}</span>
                  <input
                    type="date"
                    value={enquiryForm.paymentDate}
                    onChange={(e) =>
                      setEnquiryForm((f) => ({
                        ...f,
                        paymentDate: e.target.value,
                      }))
                    }
                  />
                </label>
              </>
            ) : null}
          </div>
          <div className="modal-buttons">
            <button type="button" className="btn" onClick={handleEnquiry}>
              {t('Submit')}
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() => setEnquiryOpen(false)}
            >
              {t('Cancel')}
            </button>
          </div>
        </dialog>
      ) : null}
    </div>
  );
};

export default VehicleDetailPage;
