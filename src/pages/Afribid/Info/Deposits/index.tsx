import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import React from 'react';
import { history } from 'umi';

const DepositsPage: React.FC = () => {
  const t = useAfribidT();
  return (
    <div>
      <div className="editorial-hero">
        <div className="container">
          <h1>{t('Deposits')}</h1>
          <p>
            {t(
              'Deposits are reserved per vehicle, frozen while you are registered, and released or applied according to the auction outcome.',
            )}
          </p>
        </div>
      </div>
      <div className="container prose content-wide" style={{ padding: '40px 0 60px' }}>
        <h2>{t('How deposits work')}</h2>
        <ul>
          <li>{t('Fund your wallet with a bank transfer and wait for verification.')}</li>
          <li>{t('Register for a lot to freeze the published vehicle deposit.')}</li>
          <li>{t('Losing, cancelled or ended auctions without a win release the deposit.')}</li>
          <li>{t('Winning bids can apply the deposit as credit against the order.')}</li>
          <li>{t('Direct-sale quotes may require a separate 20% deposit on acceptance.')}</li>
        </ul>
        <div className="notice" style={{ marginTop: 24 }}>
          {t('Amounts and timings in this prototype are illustrative. DEMO ONLY.')}
        </div>
        <button
          type="button"
          className="btn"
          style={{ marginTop: 24 }}
          onClick={() => history.push('/afribid/account/wallet')}
        >
          {t('Open wallet')}
        </button>
      </div>
    </div>
  );
};

export default DepositsPage;
