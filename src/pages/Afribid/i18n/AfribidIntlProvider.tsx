import type { AfribidLang } from '@/pages/Afribid/types';
import { useAfribidStore } from '@/stores';
import ar from '@/locales/afribid/ar';
import en from '@/locales/afribid/en';
import es from '@/locales/afribid/es';
import fr from '@/locales/afribid/fr';
import React, { useEffect, useMemo } from 'react';
import { IntlProvider } from 'react-intl';

const MESSAGES: Record<AfribidLang, Record<string, string>> = {
  en,
  fr,
  ar,
  es,
};

export const AFRIBID_LOCALES: { value: AfribidLang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
  { value: 'es', label: 'Español' },
];

interface Props {
  children: React.ReactNode;
}

/**
 * AFRIBID 独立国际化 Provider，与后台 zh-CN/en-US 隔离。
 * 文案 key 使用英文原文（与原型 i18n.js 一致），切换语言时查表翻译。
 */
const AfribidIntlProvider: React.FC<Props> = ({ children }) => {
  const lang = useAfribidStore((s) => s.lang);

  useEffect(() => {
    const prevDir = document.documentElement.getAttribute('dir');
    const prevLang = document.documentElement.getAttribute('lang');
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    return () => {
      if (prevDir) document.documentElement.setAttribute('dir', prevDir);
      else document.documentElement.removeAttribute('dir');
      if (prevLang) document.documentElement.setAttribute('lang', prevLang);
      else document.documentElement.removeAttribute('lang');
    };
  }, [lang]);

  const messages = useMemo(() => MESSAGES[lang] || MESSAGES.en, [lang]);

  return (
    <IntlProvider locale={lang} messages={messages} defaultLocale="en">
      {children}
    </IntlProvider>
  );
};

export default AfribidIntlProvider;

/** 简写：找不到翻译时回退英文原文 key */
export function useAfribidT() {
  const lang = useAfribidStore((s) => s.lang);
  return (key: string) => {
    if (lang === 'en') return key;
    return MESSAGES[lang]?.[key] || key;
  };
}
