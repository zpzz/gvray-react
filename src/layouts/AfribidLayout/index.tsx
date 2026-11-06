import AfribidIntlProvider from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { Helmet } from 'react-helmet-async';
import React from 'react';
import { Outlet } from 'umi';
import Footer from './Footer';
import Header from './Header';
import IconSprites from './IconSprites';
import './afribid.css';
import './styles.less';

/**
 * AFRIBID Marketplace 布局：独立于后台 SideNav。
 * layout: false 挂在 /afribid 路由树上。
 */
const AfribidLayout: React.FC = () => {
  return (
    <AfribidIntlProvider>
      <Helmet>
        <title>AFRIBID · Vehicle auctions</title>
        <meta name="theme-color" content="#182e35" />
      </Helmet>
      <div className="afribid-root">
        <IconSprites />
        <Header />
        <main className="afribid-main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AfribidIntlProvider>
  );
};

export default AfribidLayout;
