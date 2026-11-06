import AccountShell from '@/pages/Afribid/components/AccountShell';
import Money from '@/pages/Afribid/components/Money';
import { vehicleName } from '@/pages/Afribid/constants';
import { findVehicle } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import React from 'react';
import { history } from 'umi';

const MyAuctionsPage: React.FC = () => {
  const t = useAfribidT();
  const { registered, registrationRecords, auctions, orders } =
    useAfribidStore();

  const won = orders.filter((o) => o.source === 'Auction');

  return (
    <AccountShell title="My auctions" subtitle="Registrations, bids and results.">
      <div className="panel">
        <div className="panel-head">
          <h3>{t('Active registrations')}</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('Vehicle')}</th>
              <th>{t('Destination')}</th>
              <th>{t('Deposit')}</th>
              <th>{t('Status')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {registered.map((id) => {
              const v = findVehicle(id);
              const a = auctions[id];
              const rec = registrationRecords[id];
              if (!v) return null;
              return (
                <tr key={id}>
                  <td>
                    <b>{vehicleName(v)}</b>
                    <div className="ltr muted">{id}</div>
                  </td>
                  <td>{rec?.destination || v.country}</td>
                  <td>
                    <Money cents={v.deposit} />
                  </td>
                  <td>{t(a?.phase || v.status)}</td>
                  <td>
                    <button
                      type="button"
                      className="text-link"
                      onClick={() =>
                        history.push(
                          a ? `/afribid/live/${id}` : `/afribid/vehicle/${id}`,
                        )
                      }
                    >
                      {t('Open')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>{t('Auction orders')}</h3>
        </div>
        {won.length === 0 ? (
          <p className="muted">{t('No auction orders yet.')}</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('Order')}</th>
                <th>{t('Vehicle')}</th>
                <th>{t('Status')}</th>
                <th className="end">{t('Total')}</th>
              </tr>
            </thead>
            <tbody>
              {won.map((o) => {
                const v = findVehicle(o.vehicle);
                return (
                  <tr key={o.id}>
                    <td className="ltr">{o.id}</td>
                    <td>{v ? vehicleName(v) : o.vehicle}</td>
                    <td>{t(o.status)}</td>
                    <td className="end">
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => history.push(`/afribid/order/${o.id}`)}
                      >
                        <Money cents={o.total} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AccountShell>
  );
};

export default MyAuctionsPage;
