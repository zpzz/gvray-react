import AccountShell from '@/pages/Afribid/components/AccountShell';
import { COUNTRIES, TIMEZONES } from '@/pages/Afribid/constants';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import type { AfribidLang } from '@/pages/Afribid/types';
import { useAfribidStore } from '@/stores';
import { message } from 'antd';
import React, { useState } from 'react';

const ProfilePage: React.FC = () => {
  const t = useAfribidT();
  const { user, lang, timezone, updateProfile, setLang, setTimezone } =
    useAfribidStore();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    company: user.company,
  });

  const save = () => {
    updateProfile(form);
    message.success(t('Profile saved'));
  };

  return (
    <AccountShell title="Profile" subtitle="Contact details and preferences.">
      <div className="panel">
        <div className="form-grid">
          <label className="field">
            <span>{t('Full name')}</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
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
          <label className="field">
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
        <div className="form-actions">
          <button type="button" className="btn" onClick={save}>
            {t('Save')}
          </button>
        </div>
      </div>

      <div className="panel profile-preferences">
        <div className="panel-head">
          <h3>{t('Preferences')}</h3>
        </div>
        <div className="form-grid">
          <label className="field">
            <span>{t('Language')}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as AfribidLang)}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="es">Español</option>
            </select>
          </label>
          <label className="field">
            <span>{t('Timezone')}</span>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </AccountShell>
  );
};

export default ProfilePage;
