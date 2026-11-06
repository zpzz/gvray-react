import Money from '@/pages/Afribid/components/Money';
import { vehicleName } from '@/pages/Afribid/constants';
import { findVehicle } from '@/pages/Afribid/data/seed';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { orderDue, useAfribidStore } from '@/stores/useAfribidStore';
import { message } from 'antd';
import React, { useState } from 'react';
import { history, useParams } from 'umi';

const STEPS = [
  'Awaiting payment',
  'Partially paid',
  'Paid — awaiting delivery',
  'Completed',
];

const OrderPage: React.FC = () => {
  const t = useAfribidT();
  const { id = '' } = useParams<{ id: string }>();
  const store = useAfribidStore();
  const order = store.orders.find((o) => o.id === id);
  const vehicle = order ? findVehicle(order.vehicle) : undefined;
  const [payOpen, setPayOpen] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    payer: store.user.name,
    ref: '',
    date: '',
    file: 'demo-receipt.pdf',
  });

  if (!order) {
    return (
      <div className="container error-page">
        <h1>{t('Order not found')}</h1>
      </div>
    );
  }

  const due = orderDue(order);
  const stepIndex = Math.max(
    0,
    STEPS.findIndex((s) => s === order.status),
  );

  const submitPay = () => {
    try {
      store.submitOrderReceipt(id, {
        amount: Math.round(Number(form.amount) * 100),
        payer: form.payer,
        ref: form.ref,
        date: form.date,
        file: form.file,
      });
      message.success(t('Payment details submitted'));
      setPayOpen(false);
    } catch (err) {
      message.error(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="container">
      <div className="breadcrumb">
        <a
          href="/afribid/account/orders"
          onClick={(e) => {
            e.preventDefault();
            history.push('/afribid/account/orders');
          }}
        >
          {t('Orders')}
        </a>
        <span>/</span>
        <span className="ltr">{order.id}</span>
      </div>

      <div className="page-heading">
        <div>
          <h1>
            {t('Order')} <span className="ltr">{order.id}</span>
          </h1>
          <div className="order-head-meta">
            <span>{t(order.source)}</span>
            <span>{t(order.status)}</span>
            <span>{vehicle ? vehicleName(vehicle) : order.vehicle}</span>
          </div>
        </div>
        {due > 0 && !['Cancelled', 'Completed'].includes(order.status) ? (
          <div className="actions">
            <button type="button" className="btn" onClick={() => setPayOpen(true)}>
              {t('Submit payment receipt')}
            </button>
          </div>
        ) : null}
      </div>

      <div className="status-timeline">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={
              i < stepIndex ? 'done' : i === stepIndex ? 'current' : ''
            }
          >
            <i>{i + 1}</i>
            {t(s)}
          </div>
        ))}
      </div>

      <div className="order-layout">
        <div className="order-main">
          <div className="panel">
            <div className="panel-head">
              <h3>{t('Settlement')}</h3>
            </div>
            <div className="cost-list">
              <div>
                <span>{t('Vehicle')}</span>
                <b>
                  <Money cents={order.price} />
                </b>
              </div>
              <div>
                <span>{t('Service fee (5%)')}</span>
                <b>
                  <Money cents={order.service} />
                </b>
              </div>
              <div>
                <span>{t('Documents')}</span>
                <b>
                  <Money cents={order.docs} />
                </b>
              </div>
              <div>
                <span>{t('Transport')}</span>
                <b>
                  <Money cents={order.transport} />
                </b>
              </div>
              <div>
                <span>{t('Deposit credit')}</span>
                <b>
                  <Money cents={order.depositCredit} />
                </b>
              </div>
              <div>
                <span>{t('Paid')}</span>
                <b>
                  <Money cents={order.paid} />
                </b>
              </div>
              <div className="total">
                <span>{t('Total')}</span>
                <b>
                  <Money cents={order.total} />
                </b>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>{t('Receipts')}</h3>
            </div>
            <table className="data-table receipt-table">
              <thead>
                <tr>
                  <th>{t('Reference')}</th>
                  <th>{t('Status')}</th>
                  <th className="end">{t('Amount')}</th>
                </tr>
              </thead>
              <tbody>
                {[...order.pending, ...order.receipts].map((r) => (
                  <tr key={r.id}>
                    <td className="ltr">{r.ref}</td>
                    <td>{t(r.status)}</td>
                    <td className="end">
                      <Money cents={r.amount} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {order.delivery ? (
            <div className="panel">
              <div className="panel-head">
                <h3>{t('Delivery')}</h3>
              </div>
              <p className="body-copy">
                {order.delivery.method} · {order.delivery.receiver} ·{' '}
                <span className="ltr">{order.delivery.reference}</span>
              </p>
            </div>
          ) : null}
        </div>

        <aside className="order-summary">
          <h3>{t('Amount due')}</h3>
          <div className="amount-due">
            <small>{t('Outstanding')}</small>
            <div className="price">
              <Money cents={due} />
            </div>
          </div>
          <p className="caption">
            {t('Payment due')}: {order.due}
            <br />
            {order.location}, {order.country}
          </p>
        </aside>
      </div>

      {payOpen ? (
        <dialog open onClose={() => setPayOpen(false)}>
          <button type="button" className="modal-close" onClick={() => setPayOpen(false)}>
            ×
          </button>
          <h2>{t('Submit payment receipt')}</h2>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <label className="field">
              <span>{t('Amount (USD)')}</span>
              <input
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
              />
            </label>
            <label className="field">
              <span>{t('Payer name')}</span>
              <input
                value={form.payer}
                onChange={(e) =>
                  setForm((f) => ({ ...f, payer: e.target.value }))
                }
              />
            </label>
            <label className="field">
              <span>{t('Bank reference')}</span>
              <input
                value={form.ref}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ref: e.target.value }))
                }
              />
            </label>
            <label className="field">
              <span>{t('Date')}</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </label>
          </div>
          <div className="modal-buttons">
            <button type="button" className="btn" onClick={submitPay}>
              {t('Submit')}
            </button>
          </div>
        </dialog>
      ) : null}
    </div>
  );
};

export default OrderPage;
