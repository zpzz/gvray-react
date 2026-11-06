import Money from '@/pages/Afribid/components/Money';
import { TIMEZONES, vehicleName } from '@/pages/Afribid/constants';
import { VEHICLES } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import React, { useMemo, useState } from 'react';
import { history } from 'umi';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CalendarPage: React.FC = () => {
  const t = useAfribidT();
  const { timezone, setTimezone } = useAfribidStore();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  });
  const [selected, setSelected] = useState<string | null>(null);

  const auctions = useMemo(
    () => VEHICLES.filter((v) => v.mode === 'auction' && v.starts),
    [],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, typeof auctions>();
    auctions.forEach((v) => {
      const key = v.starts!.slice(0, 10);
      const list = map.get(key) || [];
      list.push(v);
      map.set(key, list);
    });
    return map;
  }, [auctions]);

  const year = cursor.getUTCFullYear();
  const month = cursor.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const startWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;

  const cells: Array<{ day: number | null; key: string }> = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push({ day: null, key: `e-${i}` });
  for (let d = 1; d <= daysInMonth; d += 1) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, key });
  }

  const selectedEvents = selected ? byDay.get(selected) || [] : [];

  return (
    <div className="container">
      <div className="breadcrumb">
        <span>{t('Home')}</span>
        <span>/</span>
        <span>{t('Auction calendar')}</span>
      </div>
      <div className="page-heading">
        <div>
          <h1>{t('Auction calendar')}</h1>
          <p>{t('Upcoming auction days and times.')}</p>
        </div>
        <div className="actions">
          <label className="field" style={{ marginBottom: 0, minWidth: 180 }}>
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

      <div className="calendar-layout">
        <div className="panel">
          <div className="calendar-head">
            <h3>
              {cursor.toLocaleString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
            </h3>
            <div className="actions">
              <button
                type="button"
                className="btn outline small"
                onClick={() =>
                  setCursor(new Date(Date.UTC(year, month - 1, 1)))
                }
              >
                ‹
              </button>
              <button
                type="button"
                className="btn outline small"
                onClick={() =>
                  setCursor(new Date(Date.UTC(year, month + 1, 1)))
                }
              >
                ›
              </button>
            </div>
          </div>
          <div className="calendar-grid">
            {WEEKDAYS.map((d) => (
              <div key={d} className="calendar-weekday">
                {t(d)}
              </div>
            ))}
            {cells.map((cell) => {
              if (cell.day == null) {
                return <div key={cell.key} className="calendar-day empty-day" />;
              }
              const events = byDay.get(cell.key) || [];
              return (
                <button
                  key={cell.key}
                  type="button"
                  className={`calendar-day${events.length ? ' event-day' : ''}${selected === cell.key ? ' selected' : ''}`}
                  onClick={() => setSelected(cell.key)}
                >
                  <b>{cell.day}</b>
                  {events.slice(0, 2).map((v) => (
                    <small key={v.id} className="calendar-tag">
                      {v.make}
                    </small>
                  ))}
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel calendar-events">
          <div className="panel-head">
            <h3>{selected || t('Select a day')}</h3>
          </div>
          {selectedEvents.length === 0 ? (
            <div className="empty">
              <p>{t('No auctions on this day.')}</p>
            </div>
          ) : (
            selectedEvents.map((v) => (
              <div key={v.id} className="schedule-row">
                <div>
                  <h3>{vehicleName(v)}</h3>
                  <p>
                    {v.city}, {v.country}
                  </p>
                </div>
                <div className="schedule-time">
                  {v.starts
                    ? new Date(v.starts).toLocaleString('en', {
                        timeZone: timezone,
                      })
                    : ''}
                  <small>
                    {t('Deposit')} <Money cents={v.deposit} />
                  </small>
                </div>
                <button
                  type="button"
                  className="btn small"
                  onClick={() => history.push(`/afribid/vehicle/${v.id}`)}
                >
                  {t('View')}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
