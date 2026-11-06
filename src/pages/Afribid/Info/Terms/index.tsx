import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import React from 'react';

const TermsPage: React.FC = () => {
  const t = useAfribidT();
  return (
    <div>
      <div className="editorial-hero">
        <div className="container">
          <div className="doc-meta">V1.1 · DEMO ONLY</div>
          <h1>{t('Terms')}</h1>
          <p>
            {t(
              'Illustrative customer terms for the prototype. Replace with counsel-approved language before launch.',
            )}
          </p>
        </div>
      </div>
      <div className="container prose content-wide" style={{ padding: '40px 0 60px' }}>
        <h2>{t('Participation')}</h2>
        <p>
          {t(
            'Buyers must maintain an approved account, accept these terms, and reserve the published deposit before bidding.',
          )}
        </p>
        <h2>{t('Settlements')}</h2>
        <p>
          {t(
            'Auction wins and accepted quotes create orders. Service fees, document fees and transport charges are disclosed on the quote or order summary.',
          )}
        </p>
        <h2>{t('Demo disclaimer')}</h2>
        <p>
          {t(
            'No real payments, contracts or logistics are created by this frontend prototype.',
          )}
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
