import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import React from 'react';
import { history } from 'umi';

const STEPS = [
  {
    title: 'Explore vehicles',
    copy: 'Browse auctions, fixed-price lots and enquiry-only vehicles. Review photos, specs and sale destinations.',
  },
  {
    title: 'Reserve a deposit',
    copy: 'Verified buyers fund the wallet by bank transfer, then freeze a vehicle deposit before bidding.',
  },
  {
    title: 'Bid or enquire',
    copy: 'Join the live room for auctions, or request a personalised quote for direct-sale vehicles.',
  },
  {
    title: 'Settle and collect',
    copy: 'Winning bids and accepted quotes become orders. Pay the balance, then arrange yard collection.',
  },
];

const HowItWorksPage: React.FC = () => {
  const t = useAfribidT();
  return (
    <div>
      <div className="editorial-hero">
        <div className="container">
          <div className="eyebrow">{t('BUYER JOURNEY')}</div>
          <h1>{t('How it works')}</h1>
          <p>
            {t(
              'AFRIBID is built around transparent lot details, bank-transfer deposits and a clear path from interest to collection.',
            )}
          </p>
        </div>
      </div>
      <div className="container editorial-grid">
        <nav className="editorial-nav">
          <a className="active" href="#steps">
            {t('Steps')}
          </a>
          <a
            href="/afribid/deposits"
            onClick={(e) => {
              e.preventDefault();
              history.push('/afribid/deposits');
            }}
          >
            {t('Deposits')}
          </a>
          <a
            href="/afribid/help"
            onClick={(e) => {
              e.preventDefault();
              history.push('/afribid/help');
            }}
          >
            {t('Help')}
          </a>
        </nav>
        <div className="prose" id="steps">
          <div className="steps" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {STEPS.map((step, i) => (
              <div key={step.title} className="step-card">
                <div className="step-number">0{i + 1}</div>
                <h3>{t(step.title)}</h3>
                <p>{t(step.copy)}</p>
              </div>
            ))}
          </div>
          <div className="cta-band">
            <div>
              <div className="eyebrow">{t('READY')}</div>
              <h2>{t('Explore vehicles')}</h2>
              <p>{t('Start with inventory that matches how you buy.')}</p>
            </div>
            <button
              type="button"
              className="btn"
              onClick={() => history.push('/afribid/vehicles')}
            >
              {t('Browse vehicles')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
