import AccountShell from '@/pages/Afribid/components/AccountShell';
import Money from '@/pages/Afribid/components/Money';
import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import { message } from 'antd';
import React, { useState } from 'react';

const WalletPage: React.FC = () => {
  const t = useAfribidT();
  const {
    wallet,
    transactions,
    transfers,
    refunds,
    submitTransfer,
    requestRefund,
    cancelRefund,
  } = useAfribidStore();
  const [transferOpen, setTransferOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [transfer, setTransfer] = useState({
    amount: '',
    payer: '',
    ref: '',
    date: '',
    file: 'demo-receipt.pdf',
  });
  const [refund, setRefund] = useState({ amount: '', reason: '' });

  const submitTf = () => {
    try {
      submitTransfer({
        amount: Math.round(Number(transfer.amount) * 100),
        payer: transfer.payer,
        ref: transfer.ref,
        date: transfer.date,
        file: transfer.file,
      });
      message.success(t('Transfer submitted'));
      setTransferOpen(false);
    } catch (err) {
      message.error(err instanceof Error ? err.message : String(err));
    }
  };

  const submitRf = () => {
    try {
      requestRefund({
        amount: Math.round(Number(refund.amount) * 100),
        reason: refund.reason,
      });
      message.success(t('Refund requested'));
      setRefundOpen(false);
    } catch (err) {
      message.error(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <AccountShell
      title="Wallet"
      subtitle="Available balance, frozen deposits and bank transfers."
      actions={
        <div className="row-actions">
          <button type="button" className="btn" onClick={() => setTransferOpen(true)}>
            {t('Submit bank transfer')}
          </button>
          <button
            type="button"
            className="btn outline"
            onClick={() => setRefundOpen(true)}
          >
            {t('Request refund')}
          </button>
        </div>
      }
    >
      <div className="wallet-balances">
        <div className="stat-card highlight">
          <small>{t('Available')}</small>
          <div className="stat-number">
            <span>USD</span>{' '}
            <Money cents={wallet.available} showCurrency={false} />
          </div>
        </div>
        <div className="stat-card">
          <small>{t('Frozen')}</small>
          <div className="stat-number">
            <span>USD</span> <Money cents={wallet.frozen} showCurrency={false} />
          </div>
        </div>
        <div className="stat-card">
          <small>{t('Total')}</small>
          <div className="stat-number">
            <span>USD</span>{' '}
            <Money
              cents={wallet.available + wallet.frozen}
              showCurrency={false}
            />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>{t('Bank details')}</h3>
        </div>
        <div className="bank-box">
          <div>
            <span>{t('Beneficiary')}</span>
            <b>AFRIBID DEMO LTD</b>
          </div>
          <div>
            <span>{t('IBAN')}</span>
            <b className="ltr">KE00 DEMO 0000 0000 0000 001</b>
          </div>
          <div>
            <span>{t('Reference')}</span>
            <b className="ltr">AB-008421</b>
          </div>
          <span className="bank-warning">
            {t('Use your account ID as the payment reference. DEMO ONLY.')}
          </span>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>{t('Transactions')}</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('Type')}</th>
              <th>{t('Reference')}</th>
              <th>{t('Date')}</th>
              <th className="end">{t('Amount')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{t(tx.type)}</td>
                <td className="ltr">{tx.vehicle || tx.id}</td>
                <td>{new Date(tx.date).toLocaleString()}</td>
                <td className="end">
                  <Money cents={tx.amount} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(transfers.length > 0 || refunds.length > 0) && (
        <div className="panel">
          <div className="panel-head">
            <h3>{t('Pending requests')}</h3>
          </div>
          {transfers.map((tf) => (
            <div key={tf.id} className="checklist-row">
              <span>
                {t('Transfer')} {tf.id} · <Money cents={tf.amount} /> · {t(tf.status)}
              </span>
            </div>
          ))}
          {refunds.map((rf) => (
            <div key={rf.id} className="checklist-row">
              <span>
                {t('Refund')} {rf.id} · <Money cents={rf.amount} /> · {t(rf.status)}
              </span>
              {['Pending review', 'Approved — awaiting payment'].includes(
                rf.status,
              ) ? (
                <button
                  type="button"
                  className="btn small outline"
                  onClick={() => cancelRefund(rf.id)}
                >
                  {t('Cancel')}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {transferOpen ? (
        <dialog open onClose={() => setTransferOpen(false)}>
          <button type="button" className="modal-close" onClick={() => setTransferOpen(false)}>
            ×
          </button>
          <h2>{t('Submit bank transfer')}</h2>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <label className="field">
              <span>{t('Amount (USD)')}</span>
              <input
                value={transfer.amount}
                onChange={(e) =>
                  setTransfer((f) => ({ ...f, amount: e.target.value }))
                }
              />
            </label>
            <label className="field">
              <span>{t('Payer name')}</span>
              <input
                value={transfer.payer}
                onChange={(e) =>
                  setTransfer((f) => ({ ...f, payer: e.target.value }))
                }
              />
            </label>
            <label className="field">
              <span>{t('Bank reference')}</span>
              <input
                value={transfer.ref}
                onChange={(e) =>
                  setTransfer((f) => ({ ...f, ref: e.target.value }))
                }
              />
            </label>
            <label className="field">
              <span>{t('Date')}</span>
              <input
                type="date"
                value={transfer.date}
                onChange={(e) =>
                  setTransfer((f) => ({ ...f, date: e.target.value }))
                }
              />
            </label>
          </div>
          <div className="modal-buttons">
            <button type="button" className="btn" onClick={submitTf}>
              {t('Submit')}
            </button>
          </div>
        </dialog>
      ) : null}

      {refundOpen ? (
        <dialog open onClose={() => setRefundOpen(false)}>
          <button type="button" className="modal-close" onClick={() => setRefundOpen(false)}>
            ×
          </button>
          <h2>{t('Request refund')}</h2>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <label className="field wide">
              <span>{t('Amount (USD)')}</span>
              <input
                value={refund.amount}
                onChange={(e) =>
                  setRefund((f) => ({ ...f, amount: e.target.value }))
                }
              />
            </label>
            <label className="field wide">
              <span>{t('Reason')}</span>
              <textarea
                value={refund.reason}
                onChange={(e) =>
                  setRefund((f) => ({ ...f, reason: e.target.value }))
                }
              />
            </label>
          </div>
          <div className="modal-buttons">
            <button type="button" className="btn" onClick={submitRf}>
              {t('Submit')}
            </button>
          </div>
        </dialog>
      ) : null}
    </AccountShell>
  );
};

export default WalletPage;
