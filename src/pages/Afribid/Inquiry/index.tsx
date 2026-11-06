import Money from '@/pages/Afribid/components/Money';
import Photo from '@/pages/Afribid/components/Photo';
import { vehicleName } from '@/pages/Afribid/constants';
import { findVehicle } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import { message } from 'antd';
import React from 'react';
import { history, useParams } from 'umi';

const InquiryPage: React.FC = () => {
  const t = useAfribidT();
  const { id = '' } = useParams<{ id: string }>();
  const store = useAfribidStore();
  const inquiry = store.inquiries.find((q) => q.id === id);
  const vehicle = inquiry ? findVehicle(inquiry.vehicle) : undefined;

  if (!inquiry || !vehicle) {
    return (
      <div className="container error-page">
        <h1>{t('Inquiry not found')}</h1>
      </div>
    );
  }

  const accept = () => {
    try {
      const order = store.acceptQuote(id);
      message.success(t('Quote accepted'));
      history.push(`/afribid/order/${order.id}`);
    } catch (err) {
      message.error(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="container">
      <div className="breadcrumb">
        <a
          href="/afribid/account/inquiries"
          onClick={(e) => {
            e.preventDefault();
            history.push('/afribid/account/inquiries');
          }}
        >
          {t('Inquiries')}
        </a>
        <span>/</span>
        <span className="ltr">{inquiry.id}</span>
      </div>

      <div className="inquiry-layout">
        <div>
          <div className="panel">
            <div className="inquiry-vehicle">
              <Photo name={vehicle.photos[0]} />
              <div>
                <h3>{vehicleName(vehicle)}</h3>
                <p>
                  {t(inquiry.type)} · {t(inquiry.status)}
                </p>
              </div>
            </div>
            <div className="thread">
              {inquiry.messages.map((m, i) => (
                <div
                  key={`${m.date}-${i}`}
                  className={`message${m.from === 'You' ? ' mine' : ''}`}
                >
                  <div className="message-head">
                    <b>{m.from === 'You' ? t('You') : m.from}</b>
                    <small>{new Date(m.date).toLocaleString()}</small>
                  </div>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside>
          {inquiry.quote ? (
            <div className="quote-card">
              <div className="quote-number">{inquiry.quote.id}</div>
              <h3>{t('Your quote')}</h3>
              <div className="cost-list">
                <div>
                  <span>{t('Vehicle')}</span>
                  <b>
                    <Money cents={inquiry.quote.vehicle} />
                  </b>
                </div>
                <div>
                  <span>{t('Service fee (5%)')}</span>
                  <b>
                    <Money cents={inquiry.quote.service} />
                  </b>
                </div>
                <div>
                  <span>{t('Documents')}</span>
                  <b>
                    <Money cents={inquiry.quote.docs} />
                  </b>
                </div>
                <div>
                  <span>{t('Transport')}</span>
                  <b>
                    <Money cents={inquiry.quote.transport} />
                  </b>
                </div>
                <div className="total">
                  <span>{t('Total')}</span>
                  <b>
                    <Money cents={inquiry.quote.total} />
                  </b>
                </div>
              </div>
              <div className="quote-meta">
                {t('Deposit due')}: <Money cents={inquiry.quote.deposit} />
                <br />
                {t('Expires')}: {new Date(inquiry.quote.expires).toLocaleString()}
                <br />
                {inquiry.quote.location}, {inquiry.quote.country}
              </div>
              {inquiry.status === 'Awaiting your confirmation' ? (
                <button type="button" className="btn full center" onClick={accept}>
                  {t('Accept quote')}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="panel">
              <h3>{t('Awaiting sales reply')}</h3>
              <p className="muted" style={{ marginTop: 12 }}>
                {t('Preview a sample sales reply from the demo controls.')}
              </p>
              <button
                type="button"
                className="btn"
                style={{ marginTop: 16 }}
                onClick={() => {
                  try {
                    store.generateQuote(id);
                    message.success(t('Sample quote generated'));
                  } catch (err) {
                    message.error(
                      err instanceof Error ? err.message : String(err),
                    );
                  }
                }}
              >
                {t('Preview a sample sales reply')}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default InquiryPage;
