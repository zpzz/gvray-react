import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import React, { useMemo, useState } from 'react';

const FAQS = [
  {
    cat: 'Bidding',
    q: 'How do fixed increments work?',
    a: 'Bids must follow the published step from the start price. You cannot bid if you are already the highest bidder.',
  },
  {
    cat: 'Bidding',
    q: 'What is anti-snipe?',
    a: 'If a bid arrives with fewer than 120 seconds remaining, the timer extends to 120 seconds.',
  },
  {
    cat: 'Deposits',
    q: 'When is my deposit released?',
    a: 'Deposits are released when you do not win, the auction is cancelled, or after settlement rules apply the credit to an order.',
  },
  {
    cat: 'Direct sale',
    q: 'How do enquiries become orders?',
    a: 'Sales can issue a quote. Accepting a valid quote creates an order and closes other open enquiries for that vehicle.',
  },
  {
    cat: 'Account',
    q: 'Why do I need verification?',
    a: 'An approved, unrestricted account that has accepted the terms is required before registering or accepting quotes.',
  },
];

const HelpPage: React.FC = () => {
  const t = useAfribidT();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return FAQS;
    return FAQS.filter(
      (f) =>
        f.q.toLowerCase().includes(key) ||
        f.a.toLowerCase().includes(key) ||
        f.cat.toLowerCase().includes(key),
    );
  }, [q]);

  return (
    <div>
      <div className="editorial-hero">
        <div className="container">
          <h1>{t('Help')}</h1>
          <p>{t('Search frequently asked questions about bidding, deposits and orders.')}</p>
          <div className="support-search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('Search FAQ')}
            />
          </div>
        </div>
      </div>
      <div className="container" style={{ padding: '30px 0 60px', maxWidth: 900 }}>
        <div className="faq-label">{t('FAQ')}</div>
        <div className="faq-list">
          {list.map((item) => (
            <details key={item.q}>
              <summary>
                {t(item.q)}
              </summary>
              <p>{t(item.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
