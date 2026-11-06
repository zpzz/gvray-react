import CarCard from '@/pages/Afribid/components/CarCard';
import Money from '@/pages/Afribid/components/Money';
import { assetUrl, vehicleName } from '@/pages/Afribid/constants';
import {
  HOME_COLLECTIONS,
  HOME_FILM,
  HOME_SALES,
  VEHICLES,
} from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { statusOf, useAfribidStore } from '@/stores/useAfribidStore';
import { Icon } from '@/layouts/AfribidLayout/IconSprites';
import React, { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import styles from './index.less';

const PAGE_SIZE = 4;

type CollectionKey = 'upcoming' | 'fixed' | 'enquiry';

const HomePage: React.FC = () => {
  const t = useAfribidT();
  const state = useAfribidStore();
  const [saleIndex, setSaleIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState<Record<CollectionKey, string>>({
    upcoming: '',
    fixed: '',
    enquiry: '',
  });
  const [visible, setVisible] = useState<Record<CollectionKey, number>>({
    upcoming: PAGE_SIZE,
    fixed: PAGE_SIZE,
    enquiry: PAGE_SIZE,
  });
  const [featuredIndex, setFeaturedIndex] = useState<Record<CollectionKey, number>>({
    upcoming: 0,
    fixed: 0,
    enquiry: 0,
  });

  useEffect(() => {
    document.documentElement.classList.add('home-snap');
    return () => document.documentElement.classList.remove('home-snap');
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setSaleIndex((i) => (i + 1) % HOME_SALES.length);
      setFeaturedIndex((prev) => ({
        upcoming: (prev.upcoming + 1) % HOME_COLLECTIONS[0].featured.length,
        fixed: (prev.fixed + 1) % HOME_COLLECTIONS[1].featured.length,
        enquiry: (prev.enquiry + 1) % HOME_COLLECTIONS[2].featured.length,
      }));
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const collectionVehicles = useMemo(() => {
    return {
      upcoming: VEHICLES.filter(
        (v) => v.mode === 'auction' && statusOf(v, state) === 'Upcoming',
      ),
      fixed: VEHICLES.filter(
        (v) =>
          v.mode === 'direct' &&
          statusOf(v, state) === 'Available' &&
          v.price !== null,
      ),
      enquiry: VEHICLES.filter(
        (v) =>
          v.mode === 'direct' &&
          statusOf(v, state) === 'Available' &&
          v.price === null,
      ),
    };
  }, [state]);

  const filterList = (key: CollectionKey) => {
    const q = query[key].trim().toLowerCase();
    const list = collectionVehicles[key];
    if (!q) return list;
    return list.filter((v) =>
      `${v.id} ${v.make} ${v.model} ${v.city} ${v.country}`
        .toLowerCase()
        .includes(q),
    );
  };

  const sale = HOME_SALES[saleIndex];

  return (
    <div className={`home-redesign ${styles.home}`}>
      {/* 01 Story */}
      <section className="home-story container" id="home-story">
        <div className="home-intro">
          <div className="eyebrow">
            <span />
            <span>{t('YOUR NEXT MOVE')}</span>
          </div>
          <h1>
            {t('Your next vehicle.')} <em>{t('Your price.')}</em>
          </h1>
        </div>

        <div className="home-media-pair">
          <div className="home-film">
            <img
              className="home-media-image"
              src={assetUrl(HOME_FILM.poster)}
              alt="AFRIBID film"
            />
            <div className="home-media-shade" />
            <span className="home-media-tag">{t('Company film')}</span>
            <button type="button" className="home-play" aria-label="Play">
              <Icon name="play" />
            </button>
            <div className="home-film-caption">
              <h2>{t('Built around the way you buy.')}</h2>
              <button
                type="button"
                className="text-link"
                onClick={() => history.push('/afribid/how-it-works')}
              >
                {t('How bidding works')} <Icon name="arrow" />
              </button>
            </div>
            <div className="home-video-track">
              <span />
            </div>
            <span className="home-film-preview">
              {HOME_FILM.src
                ? t('Film available')
                : t('Film placeholder — replace HOME_FILM.src')}
            </span>
          </div>

          <div className="home-sold">
            <img
              className="home-media-image"
              src={assetUrl(sale.photo)}
              alt={sale.name}
            />
            <div className="home-media-shade" />
            <span className="home-media-tag">{t('Recently sold')}</span>
            <button
              type="button"
              className="home-slide-arrow prev"
              onClick={() =>
                setSaleIndex((i) => (i - 1 + HOME_SALES.length) % HOME_SALES.length)
              }
            >
              <Icon name="arrow" className="icon back-icon" />
            </button>
            <button
              type="button"
              className="home-slide-arrow next"
              onClick={() => setSaleIndex((i) => (i + 1) % HOME_SALES.length)}
            >
              <Icon name="arrow" />
            </button>
            <div className="home-sold-caption">
              <p>
                <Icon name="pin" className="icon small" />
                {sale.city}, {sale.country}
              </p>
              <h2>{sale.name}</h2>
            </div>
            <div className="home-sold-price">
              <small>{t('Sold for')}</small>
              <strong>
                <span>USD </span>
                <Money cents={sale.price} showCurrency={false} />
              </strong>
            </div>
            <div className="home-dots">
              {HOME_SALES.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  className={i === saleIndex ? 'active' : ''}
                  onClick={() => setSaleIndex(i)}
                  aria-label={`Sale ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="home-carousel-pause"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play' : 'Pause'}
            >
              {paused ? '▶' : '❚❚'}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="home-story-next"
          onClick={() =>
            document.getElementById('home-upcoming')?.scrollIntoView({
              behavior: 'smooth',
            })
          }
        >
          <span>01 → 02</span>
          <Icon name="arrow" />
        </button>
      </section>

      {/* Collections 02–04 */}
      {HOME_COLLECTIONS.map((col) => {
        const key = col.key;
        const list = filterList(key);
        const shown = list.slice(0, visible[key]);
        const featuredId =
          col.featured[featuredIndex[key] % col.featured.length];
        const featured = VEHICLES.find((v) => v.id === featuredId);

        return (
          <section
            key={key}
            id={`home-${key}`}
            className={`home-collection${key === 'fixed' ? ' home-collection-tinted' : ''}`}
          >
            <div className="container">
              <div className="home-section-head section-head">
                <div>
                  <div className="eyebrow">
                    <span className="home-section-number">{col.number}</span>
                    <span>{t(col.label)}</span>
                  </div>
                  <h2>{t(col.title)}</h2>
                  <p>{t(col.copy)}</p>
                </div>
                <button
                  type="button"
                  className="text-link"
                  onClick={() =>
                    history.push(
                      `/afribid/vehicles?mode=${key === 'upcoming' ? 'auction' : 'direct'}`,
                    )
                  }
                >
                  {t('Browse all')} <Icon name="arrow" />
                </button>
              </div>

              <div className="home-featured">
                <a
                  className="home-featured-link"
                  href={
                    featured
                      ? `/afribid/vehicle/${featured.id}`
                      : '/afribid/vehicles'
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if (featured) history.push(`/afribid/vehicle/${featured.id}`);
                  }}
                >
                  <img
                    className="home-media-image"
                    src={assetUrl(col.banner)}
                    alt={featured ? vehicleName(featured) : col.label}
                  />
                  <div className="home-media-shade" />
                  {featured ? (
                    <div className="home-featured-caption">
                      <h3>{vehicleName(featured)}</h3>
                      <p>
                        {featured.city}, {featured.country}
                      </p>
                    </div>
                  ) : (
                    <div className="home-banner-empty">{t('No featured vehicle')}</div>
                  )}
                </a>
                {key === 'enquiry' && featured ? (
                  <button
                    type="button"
                    className="btn home-enquiry-link"
                    onClick={() => history.push(`/afribid/vehicle/${featured.id}`)}
                  >
                    {t('Enquire now')}
                  </button>
                ) : null}
              </div>

              <div className="search-bar home-catalog-search">
                <label>
                  <span>{t('Search')}</span>
                  <input
                    value={query[key]}
                    placeholder={t('Make, model or lot number')}
                    onChange={(e) =>
                      setQuery((q) => ({ ...q, [key]: e.target.value }))
                    }
                  />
                </label>
                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    setVisible((v) => ({ ...v, [key]: PAGE_SIZE }))
                  }
                >
                  {t('Search')}
                </button>
              </div>

              <div className="home-results-meta">
                <span>
                  {list.length} {t('vehicles')}
                </span>
                {query[key] ? (
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setQuery((q) => ({ ...q, [key]: '' }))}
                  >
                    {t('Clear')}
                  </button>
                ) : null}
              </div>

              <div className="cards home-vehicle-grid">
                {shown.map((v) => (
                  <CarCard key={v.id} vehicle={v} />
                ))}
              </div>

              {visible[key] < list.length ? (
                <div className="home-more">
                  <button
                    type="button"
                    className="btn outline"
                    onClick={() =>
                      setVisible((v) => ({
                        ...v,
                        [key]: v[key] + PAGE_SIZE,
                      }))
                    }
                  >
                    {t('Show more')}
                  </button>
                </div>
              ) : null}

              {col.next ? (
                <button
                  type="button"
                  className="home-next-section"
                  onClick={() =>
                    document
                      .getElementById(`home-${col.next}`)
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  {t('Next section')} <Icon name="arrow" />
                </button>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HomePage;
