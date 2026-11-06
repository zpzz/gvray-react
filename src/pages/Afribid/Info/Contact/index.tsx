import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { Icon } from '@/layouts/AfribidLayout/IconSprites';
import { message } from 'antd';
import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const t = useAfribidT();
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'General',
    message: '',
  });

  const submit = () => {
    if (!form.name || !form.email || !form.message) {
      message.error(t('Complete all required fields.'));
      return;
    }
    message.success(t('Message recorded in this demo only.'));
    setForm({ name: '', email: '', topic: 'General', message: '' });
  };

  return (
    <div className="container">
      <div className="page-heading" style={{ marginTop: 40 }}>
        <div>
          <h1>{t('Contact')}</h1>
          <p>{t('Support hours 08:00–17:00 EAT. DEMO ONLY — messages are not sent.')}</p>
        </div>
      </div>
      <div className="contact-grid">
        <div className="contact-info">
          <h2>{t('Talk to the team')}</h2>
          <p>
            {t(
              'Choose a topic and leave your details. In production this would create a support ticket.',
            )}
          </p>
          <div className="contact-item">
            <Icon name="clock" />
            <div>
              <b>{t('Hours')}</b>
              <small>08:00–17:00 EAT</small>
            </div>
          </div>
          <div className="contact-item">
            <Icon name="info" />
            <div>
              <b>{t('Topics')}</b>
              <small>
                {t('Registration, deposits, live bidding, quotes, settlement')}
              </small>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="form-grid">
            <label className="field">
              <span>{t('Name')}</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
            <label className="field wide">
              <span>{t('Topic')}</span>
              <select
                value={form.topic}
                onChange={(e) =>
                  setForm((f) => ({ ...f, topic: e.target.value }))
                }
              >
                {['General', 'Deposits', 'Bidding', 'Orders'].map((topic) => (
                  <option key={topic} value={topic}>
                    {t(topic)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field wide">
              <span>{t('Message')}</span>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={submit}>
              {t('Send')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
