import AccountShell from '@/pages/Afribid/components/AccountShell';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import { Icon } from '@/layouts/AfribidLayout/IconSprites';
import React from 'react';

const CHECKS = [
  { key: 'Identity', done: true },
  { key: 'Phone', done: true },
  { key: 'Bank details', done: true },
  { key: 'Customer terms', done: true },
  { key: 'Compliance review', done: false },
];

const VerificationPage: React.FC = () => {
  const t = useAfribidT();
  const status = useAfribidStore((s) => s.user.status);

  return (
    <AccountShell
      title="Verification"
      subtitle="Account readiness for bidding and purchase intents."
    >
      <div className="verification-state">
        <Icon name="shield" />
        <div>
          <h3>{t(status)}</h3>
          <p>
            {status === 'Verified'
              ? t('Your account can register for auctions and accept quotes.')
              : t('An approved, unrestricted account is required before bidding.')}
          </p>
        </div>
      </div>
      <div className="panel">
        {CHECKS.map((item) => (
          <div key={item.key} className="checklist-row">
            <span>{t(item.key)}</span>
            <span className={`badge ${item.done || status === 'Verified' ? 'green' : 'amber'}`}>
              {item.done || status === 'Verified' ? t('Complete') : t('Pending')}
            </span>
          </div>
        ))}
      </div>
    </AccountShell>
  );
};

export default VerificationPage;
