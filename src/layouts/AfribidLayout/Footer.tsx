import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import React, { useState } from 'react';
import { history } from 'umi';
import PreviewControls from './PreviewControls';

const LINKS = [
  { path: '/afribid/how-it-works', label: 'How it works' },
  { path: '/afribid/deposits', label: 'Deposits' },
  { path: '/afribid/help', label: 'Help' },
  { path: '/afribid/contact', label: 'Contact' },
  { path: '/afribid/terms', label: 'Terms' },
  { path: '/afribid/privacy', label: 'Privacy' },
];

const Footer: React.FC = () => {
  const t = useAfribidT();
  const resetDemo = useAfribidStore((s) => s.resetDemo);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-main">
          <a
            className="brand"
            href="/afribid/home"
            onClick={(e) => {
              e.preventDefault();
              history.push('/afribid/home');
            }}
          >
            <span className="brand-mark">
              A<span>B</span>
            </span>
            <span>
              <strong>
                AFRI<span>BID</span>
              </strong>
            </span>
          </a>
          <span>{t('Vehicle auctions. A new way forward.')}</span>
          <div className="footer-links">
            {LINKS.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  history.push(link.path);
                }}
              >
                {t(link.label)}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© AFRIBID · DEMO ONLY · V1.2</span>
          <div>
            <button type="button" onClick={() => setPreviewOpen(true)}>
              {t('Preview controls')}
            </button>
            {' · '}
            <button
              type="button"
              onClick={() => {
                resetDemo();
                window.location.reload();
              }}
            >
              {t('Reset all demo data')}
            </button>
            {' · '}
            <button type="button" onClick={() => setCreditsOpen(true)}>
              {t('Image credits')}
            </button>
          </div>
        </div>
      </div>

      <PreviewControls open={previewOpen} onClose={() => setPreviewOpen(false)} />

      {creditsOpen ? (
        <dialog open className="wide-modal" onClose={() => setCreditsOpen(false)}>
          <button
            type="button"
            className="modal-close"
            onClick={() => setCreditsOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
          <div className="modal-eyebrow">{t('Image credits')}</div>
          <h2>{t('Prototype imagery')}</h2>
          <p className="modal-copy">
            Vehicle photos and homepage banners are illustrative demo assets. Replace with
            licensed photography before production.
          </p>
          <div className="modal-buttons">
            <button type="button" className="btn dark" onClick={() => setCreditsOpen(false)}>
              {t('Close')}
            </button>
          </div>
        </dialog>
      ) : null}
    </footer>
  );
};

export default Footer;
