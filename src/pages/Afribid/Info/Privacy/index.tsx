import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import React from 'react';

const PrivacyPage: React.FC = () => {
  const t = useAfribidT();
  return (
    <div>
      <div className="editorial-hero">
        <div className="container">
          <div className="doc-meta">V1.1 · DEMO ONLY</div>
          <h1>{t('Privacy')}</h1>
          <p>
            {t(
              'Illustrative privacy notice. Profile fields in this demo are stored locally in your browser.',
            )}
          </p>
        </div>
      </div>
      <div className="container prose content-wide" style={{ padding: '40px 0 60px' }}>
        <h2>{t('Local demo data')}</h2>
        <p>
          {t(
            'The prototype persists auction and account state in localStorage under afribid-v11. Use Reset all demo data to wipe it.',
          )}
        </p>
        <h2>{t('No production processing')}</h2>
        <p>
          {t(
            'No real Google OAuth, email delivery, IP geolocation or payment processing is performed.',
          )}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
