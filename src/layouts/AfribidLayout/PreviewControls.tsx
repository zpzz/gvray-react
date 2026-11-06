import { useAfribidT } from '@/pages/Afribid/i18n/AfribidIntlProvider';
import { useAfribidStore } from '@/stores';
import { message } from 'antd';
import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * 原型 Preview controls：模拟审核员确认转账/付款/退款等，仅 demo。
 */
const PreviewControls: React.FC<Props> = ({ open, onClose }) => {
  const t = useAfribidT();
  const store = useAfribidStore();

  if (!open) return null;

  const run = (fn: () => void, ok: string) => {
    try {
      fn();
      message.success(ok);
    } catch (err) {
      message.error(err instanceof Error ? err.message : String(err));
    }
  };

  const pendingTransfer = store.transfers.find((x) => x.status === 'Pending review');
  const pendingRefund = store.refunds.find((x) => x.status === 'Pending review');
  const approvedRefund = store.refunds.find(
    (x) => x.status === 'Approved — awaiting payment',
  );
  const pendingPayment = store.orders
    .flatMap((o) => o.pending.map((p) => ({ orderId: o.id, payment: p })))
    .find((x) => x.payment.status === 'Pending review');
  const depositOrder = store.orders.find(
    (o) =>
      o.source === 'Auction' &&
      !o.depositCredit &&
      store.registered.includes(o.vehicle) &&
      o.status !== 'Cancelled',
  );
  const deliveryOrder = store.orders.find(
    (o) => o.status === 'Paid — awaiting delivery',
  );

  return (
    <dialog open className="wide-modal" onClose={onClose}>
      <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="modal-eyebrow">DEMO</div>
      <h2>{t('Preview controls')}</h2>
      <p className="modal-copy">
        Simulate operations team actions. These controls are not a real back-office.
      </p>

      <div className="demo-grid">
        <button
          type="button"
          onClick={() =>
            run(() => store.setPreviewPersona('guest'), 'Switched to guest')
          }
        >
          <b>Guest</b>
          <small>Signed out browsing</small>
        </button>
        <button
          type="button"
          onClick={() =>
            run(() => store.setPreviewPersona('verified'), 'Verified buyer')
          }
        >
          <b>Verified buyer</b>
          <small>Ready to bid and enquire</small>
        </button>
        <button
          type="button"
          onClick={() =>
            run(() => store.setPreviewPersona('pending'), 'Pending review')
          }
        >
          <b>Pending review</b>
          <small>Awaiting KYC</small>
        </button>
        <button
          type="button"
          onClick={() =>
            run(() => store.setPreviewPersona('restricted'), 'Restricted')
          }
        >
          <b>Restricted</b>
          <small>Cannot participate</small>
        </button>
        <button
          type="button"
          onClick={() =>
            run(() => store.setPreviewPersona('empty-wallet'), 'Empty wallet')
          }
        >
          <b>Empty wallet</b>
          <small>Available = 0</small>
        </button>
        <button
          type="button"
          onClick={() =>
            run(
              () => store.setDisconnected(!store.disconnected),
              store.disconnected ? 'Reconnected' : 'Disconnected',
            )
          }
        >
          <b>{store.disconnected ? 'Reconnect' : 'Go offline'}</b>
          <small>Live room connection</small>
        </button>
      </div>

      <div className="modal-buttons">
        {pendingTransfer ? (
          <button
            type="button"
            className="btn"
            onClick={() =>
              run(
                () => store.confirmTransfer(pendingTransfer.id),
                'Transfer confirmed',
              )
            }
          >
            Confirm transfer {pendingTransfer.id}
          </button>
        ) : null}
        {pendingPayment ? (
          <button
            type="button"
            className="btn"
            onClick={() =>
              run(
                () =>
                  store.confirmOrderReceipt(
                    pendingPayment.orderId,
                    pendingPayment.payment.id,
                  ),
                'Payment confirmed',
              )
            }
          >
            Confirm order payment
          </button>
        ) : null}
        {pendingRefund ? (
          <button
            type="button"
            className="btn outline"
            onClick={() =>
              run(() => store.approveRefund(pendingRefund.id), 'Refund approved')
            }
          >
            Approve refund {pendingRefund.id}
          </button>
        ) : null}
        {approvedRefund ? (
          <button
            type="button"
            className="btn outline"
            onClick={() =>
              run(() => store.completeRefund(approvedRefund.id), 'Refund paid')
            }
          >
            Mark refund paid
          </button>
        ) : null}
        {depositOrder ? (
          <button
            type="button"
            className="btn outline"
            onClick={() =>
              run(
                () => store.applyWinningDeposit(depositOrder.id),
                'Deposit applied',
              )
            }
          >
            Apply winning deposit
          </button>
        ) : null}
        {deliveryOrder ? (
          <button
            type="button"
            className="btn outline"
            onClick={() =>
              run(
                () => store.completeDelivery(deliveryOrder.id),
                'Delivery completed',
              )
            }
          >
            Complete delivery {deliveryOrder.id}
          </button>
        ) : null}
        <button
          type="button"
          className="btn dark"
          onClick={() => {
            store.resetDemo();
            window.location.reload();
          }}
        >
          {t('Reset all demo data')}
        </button>
        <button type="button" className="btn ghost" onClick={onClose}>
          {t('Close')}
        </button>
      </div>
    </dialog>
  );
};

export default PreviewControls;
