import { COUNTRIES } from '@/pages/Afribid/constants';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';

const RegisterPage: React.FC = () => {
  const t = useAfribidT();
  const { session, user, completeOnboarding, signInAs } = useAfribidStore();
  const [form, setForm] = useState({
    name: user.name || '',
    type: user.type || 'Individual',
    company: user.company || '',
    email: user.email || '',
    phone: user.phone || '',
    country: user.country || 'Kenya',
    terms: false,
  });

  useEffect(() => {
    if (!session) signInAs('first-time');
  }, [session, signInAs]);

  const submit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      message.error(t('Complete all required fields.'));
      return;
    }
    if (!form.terms) {
      message.error(t('Please accept the customer terms first.'));
      return;
    }
    completeOnboarding({
      name: form.name,
      type: form.type,
      company: form.company,
      email: form.email,
      phone: form.phone,
      country: form.country,
      terms: 'V1.1',
    });
    message.success(t('Profile submitted for review'));
    history.push('/afribid/account/verification');
  };

  return (
    <div className="auth-layout">
      <div className="auth-art">
        <div className="eyebrow">{t('ONBOARDING')}</div>
        <h1>
          {t('Tell us about')} <em>{t('your buying profile')}</em>
        </h1>
        <p>
          {t(
            'Complete this form once. An approved, unrestricted account is required before bidding.',
          )}
        </p>
      </div>
      <div className="auth-form">
        <h2>{t('Register')}</h2>
        <p className="muted">{t('Demo onboarding — Pending review after submit.')}</p>
        <div className="form-grid">
          <label className="field wide">
            <span>{t('Full name')}</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="field">
            <span>{t('Buyer type')}</span>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="Individual">{t('Individual')}</option>
              <option value="Company">{t('Company')}</option>
            </select>
          </label>
          <label className="field">
            <span>{t('Company')}</span>
            <input
              value={form.company}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
            />
          </label>
          <label className="field">
            <span>{t('Email')}</span>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </label>
          <label className="field">
            <span>{t('Phone')}</span>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          </label>
          <label className="field wide">
            <span>{t('Country')}</span>
            <select
              value={form.country}
              onChange={(e) =>
                setForm((f) => ({ ...f, country: e.target.value }))
              }
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="check-field">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) =>
              setForm((f) => ({ ...f, terms: e.target.checked }))
            }
          />
          <span>
            {t('I accept the')}{' '}
            <a
              href="/afribid/terms"
              onClick={(e) => {
                e.preventDefault();
                history.push('/afribid/terms');
              }}
            >
              {t('Terms')}
            </a>
          </span>
        </label>
        <div className="form-actions">
          <button type="button" className="btn" onClick={submit}>
            {t('Submit for review')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
