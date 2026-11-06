import AccountShell from '@/pages/Afribid/components/AccountShell';
import Money from '@/pages/Afribid/components/Money';
import { vehicleName } from '@/pages/Afribid/constants';
import { findVehicle } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import React, { useState } from 'react';
import { history } from 'umi';

const InquiriesPage: React.FC = () => {
  const t = useAfribidT();
  const inquiries = useAfribidStore((s) => s.inquiries);
  const [status, setStatus] = useState('all');

  const list =
    status === 'all'
      ? inquiries
      : inquiries.filter((q) => q.status === status);

  return (
    <AccountShell title="Inquiries" subtitle="Direct-sale conversations and quotes.">
      <div className="table-toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">{t('All statuses')}</option>
          {[
            'Pending',
            'Awaiting your confirmation',
            'Converted to order',
            'Closed',
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
              <th>{t('Inquiry')}</th>
              <th>{t('Vehicle')}</th>
              <th>{t('Type')}</th>
              <th>{t('Status')}</th>
              <th className="end">{t('Amount')}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((q) => {
              const v = findVehicle(q.vehicle);
              return (
                <tr key={q.id}>
                  <td>
                    <button
                      type="button"
                      className="text-link ltr"
                      onClick={() => history.push(`/afribid/inquiry/${q.id}`)}
                    >
                      {q.id}
                    </button>
                  </td>
                  <td>{v ? vehicleName(v) : q.vehicle}</td>
                  <td>{t(q.type)}</td>
                  <td>{t(q.status)}</td>
                  <td className="end">
                    <Money cents={q.amount ?? q.quote?.total ?? null} />
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

export default InquiriesPage;
