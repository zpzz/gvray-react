import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import React from 'react';
import { history } from 'umi';

const RestrictedPage: React.FC = () => {
  const t = useAfribidT();
  return (
    <div className="container error-page">
      <div className="region-icon">!</div>
      <h1>{t('Access restricted')}</h1>
      <p>
        {t(
          'This demo page simulates a regional or compliance restriction. It is not a real geo-block.',
        )}
      </p>
      <div className="actions">
        <button
          type="button"
          className="btn"
          onClick={() => history.push('/afribid/home')}
        >
          {t('Back to home')}
        </button>
        <button
          type="button"
          className="btn outline"
          onClick={() => history.push('/afribid/contact')}
        >
          {t('Contact')}
        </button>
      </div>
    </div>
  );
};

export default RestrictedPage;
