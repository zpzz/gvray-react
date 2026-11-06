import CarCard from '@/pages/Afribid/components/CarCard';
import { VEHICLES } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { statusOf, useAfribidStore } from '@/stores/useAfribidStore';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'umi';

const PAGE_SIZE = 6;

const VehiclesPage: React.FC = () => {
  const t = useAfribidT();
  const state = useAfribidStore();
  const [params] = useSearchParams();
  const initialMode = params.get('mode') || 'all';

  const [keyword, setKeyword] = useState('');
  const [make, setMake] = useState('all');
  const [body, setBody] = useState('all');
  const [country, setCountry] = useState('all');
  const [mode, setMode] = useState(initialMode);
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const makes = useMemo(
    () => [...new Set(VEHICLES.map((v) => v.make))].sort(),
    [],
  );
  const bodies = useMemo(
    () => [...new Set(VEHICLES.map((v) => v.body))].sort(),
    [],
  );
  const countries = useMemo(
    () => [...new Set(VEHICLES.map((v) => v.country))].sort(),
    [],
  );

  const filtered = useMemo(() => {
    let list = VEHICLES.filter((v) => {
      const st = statusOf(v, state);
      if (mode === 'auction' && v.mode !== 'auction') return false;
      if (mode === 'direct' && v.mode !== 'direct') return false;
      if (make !== 'all' && v.make !== make) return false;
      if (body !== 'all' && v.body !== body) return false;
      if (country !== 'all' && v.country !== country) return false;
      if (status !== 'all' && st !== status) return false;
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        if (
          !`${v.id} ${v.make} ${v.model} ${v.city} ${v.vin}`
            .toLowerCase()
            .includes(q)
        ) {
          return false;
        }
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'price-asc')
        return (a.price || 0) - (b.price || 0);
      if (sort === 'price-desc')
        return (b.price || 0) - (a.price || 0);
      if (sort === 'mileage') return a.mileage - b.mileage;
      return b.year - a.year;
    });
    return list;
  }, [state, keyword, make, body, country, mode, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const reset = () => {
    setKeyword('');
    setMake('all');
    setBody('all');
    setCountry('all');
    setMode('all');
    setStatus('all');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="container">
      <div className="breadcrumb">
        <span>{t('Home')}</span>
        <span>/</span>
        <span>{t('Vehicles')}</span>
      </div>
      <div className="page-heading">
        <div>
          <h1>{t('Find your next vehicle')}</h1>
          <p>{t('Filter by make, body, location, sale type and status.')}</p>
        </div>
      </div>

      <div className="inventory-layout">
        <aside className="filters">
          <div className="filters-head">
            <h3>{t('Filters')}</h3>
            <button type="button" onClick={reset}>
              {t('Clear')}
            </button>
          </div>

          <label className="field">
            <span>{t('Keyword')}</span>
            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              placeholder={t('Make, model or lot number')}
            />
          </label>

          <div className="filter-group">
            <label>
              <input
                type="radio"
                checked={mode === 'all'}
                onChange={() => {
                  setMode('all');
                  setPage(1);
                }}
              />
              {t('All sale types')}
            </label>
            <label>
              <input
                type="radio"
                checked={mode === 'auction'}
                onChange={() => {
                  setMode('auction');
                  setPage(1);
                }}
              />
              {t('Auction')}
            </label>
            <label>
              <input
                type="radio"
                checked={mode === 'direct'}
                onChange={() => {
                  setMode('direct');
                  setPage(1);
                }}
              />
              {t('Direct sale')}
            </label>
          </div>

          <label className="field">
            <span>{t('Make')}</span>
            <select
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">{t('All makes')}</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t('Body type')}</span>
            <select
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">{t('All types')}</option>
              {bodies.map((b) => (
                <option key={b} value={b}>
                  {t(b)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t('Vehicle location')}</span>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">{t('All locations')}</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t('Status')}</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">{t('All statuses')}</option>
              {['Live', 'Upcoming', 'Available', 'Reserved', 'Sold'].map(
                (s) => (
                  <option key={s} value={s}>
                    {t(s)}
                  </option>
                ),
              )}
            </select>
          </label>
        </aside>

        <div className="inventory-results">
          <div className="results-head">
            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              placeholder={t('Search inventory')}
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">{t('Newest first')}</option>
              <option value="price-asc">{t('Price: low to high')}</option>
              <option value="price-desc">{t('Price: high to low')}</option>
              <option value="mileage">{t('Lowest mileage')}</option>
            </select>
          </div>

          <p className="results-count">
            {filtered.length} {t('vehicles')}
          </p>

          {pageItems.length === 0 ? (
            <div className="empty">
              <h3>{t('No vehicles match')}</h3>
              <p>{t('Try clearing filters or broadening your search.')}</p>
              <button type="button" className="btn outline" onClick={reset}>
                {t('Clear')}
              </button>
            </div>
          ) : (
            <div className="cards">
              {pageItems.map((v) => (
                <CarCard key={v.id} vehicle={v} />
              ))}
            </div>
          )}

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={p === currentPage ? 'active' : ''}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclesPage;
