import Photo from '@/pages/Afribid/components/Photo';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import { Icon } from '@/layouts/AfribidLayout/IconSprites';
import React from 'react';
import { history } from 'umi';

const LoginPage: React.FC = () => {
  const t = useAfribidT();
  const signInAs = useAfribidStore((s) => s.signInAs);

  const continueAs = (mode: 'returning' | 'first-time') => {
    signInAs(mode);
    history.push(mode === 'first-time' ? '/afribid/register' : '/afribid/account');
  };

  return (
    <div className="auth-layout">
      <div className="auth-art">
        <div className="eyebrow">{t('YOUR NEXT MOVE')}</div>
        <h1>
          {t('Sign in')} <em>{t('to bid with confidence')}</em>
        </h1>
        <p>
          {t(
            'Continue with the demo Google flow. Returning buyers land in the account; first-time buyers complete onboarding.',
          )}
        </p>
        <Photo name="reference-hilux" className="photo reference-hilux" />
      </div>
      <div className="auth-form">
        <h2>{t('Sign in')}</h2>
        <p className="muted">
          {t('Demo only — no real Google OAuth is performed.')}
        </p>
        <button
          type="button"
          className="google-btn"
          onClick={() => continueAs('returning')}
        >
          <span className="google-g">G</span>
          {t('Continue with Google')}
        </button>
        <div className="auth-divider">{t('Demo personas')}</div>
        <div className="modal-buttons">
          <button
            type="button"
            className="btn"
            onClick={() => continueAs('returning')}
          >
            {t('Returning buyer')}
          </button>
          <button
            type="button"
            className="btn outline"
            onClick={() => continueAs('first-time')}
          >
            {t('First-time buyer')}
          </button>
        </div>
        <div className="auth-note">
          <Icon name="info" />
          {t('All account and auction data on this prototype is illustrative.')}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
