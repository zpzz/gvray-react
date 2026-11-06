import AccountShell from '@/pages/Afribid/components/AccountShell';
import Money from '@/pages/Afribid/components/Money';
import { vehicleName } from '@/pages/Afribid/constants';
import { findVehicle } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { orderDue, useAfribidStore } from '@/stores/useAfribidStore';
import React, { useState } from 'react';
import { history } from 'umi';

const OrdersPage: React.FC = () => {
  const t = useAfribidT();
  const orders = useAfribidStore((s) => s.orders);
  const [source, setSource] = useState('all');
  const [status, setStatus] = useState('all');

  const list = orders.filter((o) => {
    if (source !== 'all' && o.source !== source) return false;
    if (status !== 'all' && o.status !== status) return false;
    return true;
  });

  return (
    <AccountShell title="Orders" subtitle="Settlement, receipts and delivery.">
      <div className="table-toolbar">
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="all">{t('All sources')}</option>
          <option value="Auction">{t('Auction')}</option>
          <option value="Direct sale">{t('Direct sale')}</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">{t('All statuses')}</option>
          {[
            'Awaiting payment',
            'Partially paid',
            'Paid — awaiting delivery',
            'Completed',
            'Cancelled',
          ].map((s) => (
            <option key={s} value={s}>
              {t(s)}
            </option>
          ))}
        </select>
      </div>
      <div className="panel p0">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('Order')}</th>
              <th>{t('Vehicle')}</th>
              <th>{t('Source')}</th>
              <th>{t('Status')}</th>
              <th className="end">{t('Due')}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => {
              const v = findVehicle(o.vehicle);
              return (
                <tr key={o.id}>
                  <td>
                    <button
                      type="button"
                      className="text-link ltr"
                      onClick={() => history.push(`/afribid/order/${o.id}`)}
                    >
                      {o.id}
                    </button>
                  </td>
                  <td>{v ? vehicleName(v) : o.vehicle}</td>
                  <td>{t(o.source)}</td>
                  <td>{t(o.status)}</td>
                  <td className="end">
                    <Money cents={orderDue(o)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AccountShell>
  );
};

export default OrdersPage;
