import {
  ANTI_SNIPE_MS,
  DEMO_VERSION,
  DOCS_FEE,
  SERVICE_RATE,
  STORAGE_KEY,
} from '@/pages/Afribid/constants';
import { createSeedState, findVehicle, VEHICLES } from '@/pages/Afribid/data/seed';
import type {
  AfribidLang,
  AfribidState,
  Inquiry,
  Order,
  Vehicle,
} from '@/pages/Afribid/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type EnquiryForm = {
  message: string;
  country: string;
  location: string;
  amount?: number;
  paymentDate?: string;
};

type TransferForm = {
  amount: number;
  payer: string;
  ref: string;
  date: string;
  file: string;
};

type RefundForm = { amount: number; reason: string };

type OrderReceiptForm = TransferForm;

interface AfribidActions {
  setLang: (lang: AfribidLang) => void;
  setTimezone: (tz: string) => void;
  resetDemo: () => void;
  signInAs: (mode: 'returning' | 'first-time' | 'guest') => void;
  signOut: () => void;
  completeOnboarding: (patch: Partial<AfribidState['user']>) => void;
  setPreviewPersona: (
    persona: 'guest' | 'verified' | 'pending' | 'restricted' | 'empty-wallet',
  ) => void;
  toggleWatchlist: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setDisconnected: (value: boolean) => void;
  pauseAuction: (id: string) => void;
  resumeAuction: (id: string) => void;
  registerVehicle: (id: string, destination: string) => void;
  submitBid: (id: string, amount: number) => number;
  finishAuction: (id: string, cancelled?: boolean) => void;
  createEnquiry: (
    id: string,
    type: 'Inquiry' | 'Purchase intent',
    form: EnquiryForm,
  ) => { created?: Inquiry; existing?: Inquiry };
  generateQuote: (inquiryId: string) => void;
  acceptQuote: (inquiryId: string) => Order;
  submitTransfer: (form: TransferForm) => void;
  confirmTransfer: (id: string) => void;
  requestRefund: (form: RefundForm) => void;
  approveRefund: (id: string) => void;
  completeRefund: (id: string) => void;
  cancelRefund: (id: string) => void;
  submitOrderReceipt: (orderId: string, form: OrderReceiptForm) => void;
  confirmOrderReceipt: (orderId: string, paymentId: string) => void;
  applyWinningDeposit: (orderId: string) => void;
  completeDelivery: (orderId: string) => void;
  updateProfile: (patch: Partial<AfribidState['user']>) => void;
  // selectors helpers exposed via getState in utils
}

export type AfribidStore = AfribidState & AfribidActions;

function newId(state: AfribidState, prefix: string) {
  state.seq += 1;
  return `${prefix}-${state.seq}`;
}

function addTransaction(
  state: AfribidState,
  type: string,
  amount: number,
  reference: string,
) {
  state.transactions.unshift({
    id: newId(state, 'TX'),
    type,
    amount,
    vehicle: reference,
    date: new Date().toISOString(),
    status: 'Confirmed',
  });
}

function addNotification(
  state: AfribidState,
  type: string,
  title: string,
  body: string,
  route: string,
) {
  state.notifications.unshift({
    id: newId(state, 'N'),
    type,
    title,
    body,
    route,
    date: new Date().toISOString(),
    read: false,
  });
}

function requireBuyer(state: AfribidState) {
  if (!state.session) throw new Error('Please sign in to continue.');
  if (!state.onboarded)
    throw new Error('Complete your profile before participating.');
  if (state.user.status !== 'Verified')
    throw new Error('An approved, unrestricted account is required.');
  if (!state.user.accepted)
    throw new Error('Please accept the customer terms first.');
}

export function statusOf(vehicle: Vehicle, state: AfribidState): string {
  if (
    state.orders.some(
      (o) =>
        o.vehicle === vehicle.id &&
        !['Cancelled', 'Completed'].includes(o.status),
    )
  ) {
    return 'Reserved';
  }
  if (
    state.orders.some(
      (o) => o.vehicle === vehicle.id && o.status === 'Completed',
    )
  ) {
    return 'Sold';
  }
  return state.auctions[vehicle.id]?.phase || vehicle.status;
}

export function amountOf(vehicle: Vehicle, state: AfribidState): number | null {
  return state.auctions[vehicle.id]?.price ?? vehicle.price;
}

export function orderDue(order: Order): number {
  return Math.max(0, order.total - order.paid - order.depositCredit);
}

export function isEligible(vehicleId: string, state: AfribidState): boolean {
  return !!(
    state.session &&
    state.onboarded &&
    state.user.status === 'Verified' &&
    state.user.accepted &&
    state.registered.includes(vehicleId)
  );
}

export const useAfribidStore = create<AfribidStore>()(
  persist(
    immer((set, get) => ({
      ...createSeedState(),

      setLang: (lang) =>
        set((s) => {
          s.lang = lang;
        }),

      setTimezone: (tz) =>
        set((s) => {
          s.timezone = tz;
        }),

      resetDemo: () =>
        set((s) => {
          const lang = s.lang;
          Object.assign(s, createSeedState());
          s.lang = lang;
        }),

      signInAs: (mode) =>
        set((s) => {
          if (mode === 'guest') {
            s.session = false;
            return;
          }
          s.session = true;
          if (mode === 'first-time') {
            s.onboarded = false;
            s.user.status = 'Pending review';
            s.user.accepted = null;
          } else {
            s.onboarded = true;
            s.user.status = 'Verified';
            s.user.accepted = s.user.accepted || new Date().toISOString();
          }
        }),

      signOut: () =>
        set((s) => {
          s.session = false;
        }),

      completeOnboarding: (patch) =>
        set((s) => {
          Object.assign(s.user, patch);
          s.user.accepted = new Date().toISOString();
          s.user.status = 'Pending review';
          s.onboarded = true;
        }),

      setPreviewPersona: (persona) =>
        set((s) => {
          if (persona === 'guest') {
            s.session = false;
            return;
          }
          s.session = true;
          s.onboarded = true;
          if (persona === 'verified') {
            s.user.status = 'Verified';
            s.user.accepted = s.user.accepted || new Date().toISOString();
          } else if (persona === 'pending') {
            s.user.status = 'Pending review';
          } else if (persona === 'restricted') {
            s.user.status = 'Restricted';
          } else if (persona === 'empty-wallet') {
            s.user.status = 'Verified';
            s.user.accepted = s.user.accepted || new Date().toISOString();
            s.wallet.available = 0;
          }
        }),

      toggleWatchlist: (id) =>
        set((s) => {
          if (s.watchlist.includes(id)) {
            s.watchlist = s.watchlist.filter((x) => x !== id);
          } else {
            s.watchlist.push(id);
          }
        }),

      markNotificationRead: (id) =>
        set((s) => {
          const n = s.notifications.find((x) => x.id === id);
          if (n) n.read = true;
        }),

      markAllNotificationsRead: () =>
        set((s) => {
          s.notifications.forEach((n) => {
            n.read = true;
          });
        }),

      setDisconnected: (value) =>
        set((s) => {
          s.disconnected = value;
        }),

      pauseAuction: (id) =>
        set((s) => {
          const a = s.auctions[id];
          if (!a || a.phase !== 'Live') return;
          a.pauseRemaining = Math.max(0, a.end - Date.now());
          a.phase = 'Paused';
        }),

      resumeAuction: (id) =>
        set((s) => {
          const a = s.auctions[id];
          if (!a || a.phase !== 'Paused') return;
          // 原型：恢复时至少给 120s，避免立刻结束
          a.end = Date.now() + Math.max(a.pauseRemaining || 0, ANTI_SNIPE_MS);
          a.phase = 'Live';
          delete a.pauseRemaining;
        }),

      registerVehicle: (id, destination) =>
        set((s) => {
          requireBuyer(s);
          const v = findVehicle(id);
          const a = s.auctions[id];
          if (!v || v.mode !== 'auction') {
            throw new Error('Registration is closed for this vehicle.');
          }
          const status = statusOf(v, s);
          if (['Reserved', 'Sold', 'Ended', 'Cancelled'].includes(status)) {
            throw new Error('Registration is closed for this vehicle.');
          }
          if (a && (a.phase !== 'Live' || a.end <= Date.now())) {
            throw new Error('Registration is closed for this vehicle.');
          }
          if (!a && v.starts && new Date(v.starts).getTime() <= Date.now()) {
            throw new Error('Registration is closed for this vehicle.');
          }
          if (!v.saleCountries.includes(destination)) {
            throw new Error(
              'This destination needs an eligibility review. Contact the team before registering.',
            );
          }
          if (s.registered.includes(id)) return;
          if (s.wallet.available < v.deposit) {
            throw new Error(
              'Insufficient available deposit. Submit a bank transfer and wait for verification.',
            );
          }
          s.wallet.available -= v.deposit;
          s.wallet.frozen += v.deposit;
          s.registered.push(id);
          s.registrationRecords[id] = {
            destination,
            terms: 'Auction V1.1',
            acceptedAt: new Date().toISOString(),
            deposit: v.deposit,
          };
          addTransaction(s, 'Deposit reserved', -v.deposit, id);
          addNotification(
            s,
            'Registration',
            'Your auction place is reserved',
            'Your vehicle deposit has been frozen successfully.',
            `/afribid/vehicle/${id}`,
          );
        }),

      submitBid: (id, amount) => {
        let result = 0;
        set((s) => {
          requireBuyer(s);
          const v = findVehicle(id);
          const a = s.auctions[id];
          if (!v || !a || v.mode !== 'auction') {
            throw new Error('This auction has not started yet.');
          }
          if (!s.registered.includes(id)) {
            throw new Error(
              'Register and reserve this vehicle deposit before bidding.',
            );
          }
          if (s.disconnected) {
            throw new Error(
              'Connection lost. Reconnect and review the latest price.',
            );
          }
          if (a.phase !== 'Live') {
            throw new Error('This auction is not accepting bids.');
          }
          if (a.end <= Date.now()) {
            get().finishAuction(id);
            throw new Error('This auction has ended.');
          }
          if (
            !Number.isSafeInteger(amount) ||
            amount < (v.startPrice || 0) ||
            (amount - (v.startPrice || 0)) % (v.step || 1) !== 0
          ) {
            throw new Error(
              'Your bid must follow the published fixed increment.',
            );
          }
          if (amount < a.price + (v.step || 0)) {
            throw new Error(
              'The price has changed. Review the current price and submit a higher bid.',
            );
          }
          if (a.leader === 'You') {
            throw new Error('You are already the highest bidder.');
          }
          a.price = amount;
          a.leader = 'You';
          a.mine = amount;
          a.bids += 1;
          const prior = (a.history[0]?.time || '12:00:00').split(':').map(Number);
          const secs = prior[0] * 3600 + prior[1] * 60 + prior[2] + 7;
          a.history.unshift({
            who: 'You',
            amount,
            time: [
              Math.floor(secs / 3600) % 24,
              Math.floor(secs / 60) % 60,
              secs % 60,
            ]
              .map((n) => String(n).padStart(2, '0'))
              .join(':'),
          });
          if (a.end - Date.now() < ANTI_SNIPE_MS) {
            a.end = Date.now() + ANTI_SNIPE_MS;
            a.extended = true;
          }
          result = amount;
        });
        return result;
      },

      finishAuction: (id, cancelled = false) =>
        set((s) => {
          const a = s.auctions[id];
          const v = findVehicle(id);
          if (!a || !v || ['Ended', 'Cancelled'].includes(a.phase)) return;
          a.phase = cancelled ? 'Cancelled' : 'Ended';
          a.end = Date.now();
          if (a.leader === 'You' && !cancelled && a.bids > 0) {
            if (
              !s.orders.some((o) => o.vehicle === id && o.source === 'Auction')
            ) {
              const price = a.price;
              const service = Math.round(price * SERVICE_RATE);
              const docs = DOCS_FEE;
              const order: Order = {
                id: newId(s, 'ORD'),
                vehicle: id,
                source: 'Auction',
                status: 'Awaiting payment',
                price,
                service,
                docs,
                transport: 0,
                insurance: 0,
                total: price + service + docs,
                depositCredit: 0,
                paid: 0,
                pending: [],
                due: new Date(Date.now() + 3 * 86400000)
                  .toISOString()
                  .slice(0, 10),
                country:
                  s.registrationRecords[id]?.destination || v.country,
                location: `${v.city} collection yard`,
                created: new Date().toISOString(),
                terms: 'Auction V1.1',
                receipts: [],
                delivery: null,
              };
              s.orders.unshift(order);
              addNotification(
                s,
                'Auction won',
                'Congratulations on your winning bid',
                'Your order and settlement details are available.',
                `/afribid/order/${order.id}`,
              );
            }
          } else if (s.registered.includes(id)) {
            // release deposit
            const deposit = v.deposit;
            s.registrationRecords[id] = {
              ...(s.registrationRecords[id] || {
                destination: v.country,
                terms: 'Auction V1.1',
                deposit,
              }),
              releasedAt: new Date().toISOString(),
            };
            s.registered = s.registered.filter((x) => x !== id);
            s.wallet.frozen -= deposit;
            s.wallet.available += deposit;
            addTransaction(s, 'Deposit released', deposit, id);
          }
        }),

      createEnquiry: (id, type, form) => {
        let result: { created?: Inquiry; existing?: Inquiry } = {};
        set((s) => {
          if (!s.session) throw new Error('Please sign in to continue.');
          if (s.user.status === 'Suspended') {
            throw new Error('This account is suspended. Contact support.');
          }
          const v = findVehicle(id);
          if (!v || v.mode !== 'direct' || statusOf(v, s) !== 'Available') {
            throw new Error(
              'This vehicle is no longer available for new enquiries.',
            );
          }
          if (type === 'Purchase intent') {
            requireBuyer(s);
            const prior = s.inquiries.find(
              (q) =>
                q.vehicle === id &&
                q.type === 'Purchase intent' &&
                !['Closed', 'Converted to order'].includes(q.status),
            );
            if (prior) {
              result = { existing: prior };
              return;
            }
          }
          if (!form.message.trim() || !form.country || !form.location.trim()) {
            throw new Error('Complete all required fields.');
          }
          if (
            type === 'Purchase intent' &&
            (!Number.isSafeInteger(form.amount) ||
              !form.amount ||
              form.amount <= 0 ||
              !form.paymentDate)
          ) {
            throw new Error(
              'Enter a valid intent price and expected payment date.',
            );
          }
          const q: Inquiry = {
            id: newId(s, 'INQ'),
            vehicle: id,
            type,
            status: 'Pending',
            amount: form.amount || null,
            snapshot: v.price,
            country: form.country,
            location: form.location,
            paymentDate: form.paymentDate || '',
            created: new Date().toISOString(),
            messages: [
              {
                from: 'You',
                text: form.message,
                date: new Date().toISOString(),
                key: false,
              },
            ],
            quote: null,
          };
          s.inquiries.unshift(q);
          result = { created: q };
        });
        return result;
      },

      generateQuote: (inquiryId) =>
        set((s) => {
          const q = s.inquiries.find((x) => x.id === inquiryId);
          if (!q || ['Closed', 'Converted to order'].includes(q.status)) {
            throw new Error('This enquiry is closed.');
          }
          const v = findVehicle(q.vehicle);
          if (!v || statusOf(v, s) !== 'Available') {
            throw new Error('This vehicle is no longer available for a quote.');
          }
          if (q.quote) {
            q.quoteHistory = q.quoteHistory || [];
            q.quoteHistory.push(structuredClone(q.quote));
          }
          const price = q.amount || v.price || 2350000;
          const service = Math.round(price * SERVICE_RATE);
          const docs = DOCS_FEE;
          const transport = q.location
            .toLowerCase()
            .includes(v.city.toLowerCase())
            ? 0
            : 35000;
          q.quote = {
            id: newId(s, 'QT'),
            vehicle: price,
            service,
            docs,
            transport,
            insurance: 0,
            total: price + service + docs + transport,
            deposit: Math.round(price * 0.2),
            expires: Date.now() + 48 * 3600000,
            paymentDue:
              q.paymentDate ||
              new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
            country: q.country,
            location: q.location,
          };
          q.status = 'Awaiting your confirmation';
          q.messages.push({
            from: 'AFRIBID sales',
            text: 'Your personalised quote is ready. Please review the price, fees and collection terms below.',
            date: new Date().toISOString(),
            key: true,
          });
          addNotification(
            s,
            'Inquiry reply',
            'Your vehicle quote is ready',
            'Review the price, fees and delivery terms in your enquiry.',
            `/afribid/inquiry/${q.id}`,
          );
        }),

      acceptQuote: (inquiryId) => {
        let order!: Order;
        set((s) => {
          requireBuyer(s);
          const q = s.inquiries.find((x) => x.id === inquiryId);
          if (!q || !q.quote) throw new Error('This quote is unavailable.');
          if (q.order) {
            order = s.orders.find((o) => o.id === q.order)!;
            return;
          }
          if (
            q.status !== 'Awaiting your confirmation' ||
            q.quote.expires <= Date.now()
          ) {
            throw new Error(
              'This quote has expired or is no longer available.',
            );
          }
          const v = findVehicle(q.vehicle);
          if (!v || statusOf(v, s) !== 'Available') {
            throw new Error('Another order has reserved this vehicle.');
          }
          const x = q.quote;
          order = {
            id: newId(s, 'ORD'),
            vehicle: q.vehicle,
            source: 'Direct sale',
            status: 'Awaiting payment',
            price: x.vehicle,
            service: x.service,
            docs: x.docs,
            transport: x.transport,
            insurance: x.insurance,
            total: x.total,
            depositCredit: 0,
            paid: 0,
            pending: [],
            due: x.paymentDue,
            country: x.country,
            location: x.location,
            created: new Date().toISOString(),
            terms: 'Direct sale V1.1',
            quoteId: x.id,
            requiredDeposit: x.deposit,
            receipts: [],
            delivery: null,
          };
          s.orders.unshift(order);
          q.status = 'Converted to order';
          q.order = order.id;
          s.inquiries
            .filter(
              (other) =>
                other.id !== q.id &&
                other.vehicle === q.vehicle &&
                !['Closed', 'Converted to order'].includes(other.status),
            )
            .forEach((other) => {
              other.status = 'Closed';
              other.messages.push({
                from: 'AFRIBID sales',
                text: 'This vehicle has been reserved by an order. This enquiry is now closed.',
                date: new Date().toISOString(),
                key: true,
              });
            });
        });
        return order;
      },

      submitTransfer: (form) =>
        set((s) => {
          if (!s.session) throw new Error('Please sign in to continue.');
          if (
            !Number.isSafeInteger(form.amount) ||
            form.amount <= 0 ||
            !form.payer.trim() ||
            !form.ref.trim() ||
            !form.date ||
            !form.file
          ) {
            throw new Error(
              'Complete the payment details and attach a receipt.',
            );
          }
          if (s.transfers.some((x) => x.ref === form.ref)) {
            throw new Error('This bank reference has already been submitted.');
          }
          s.transfers.unshift({
            id: newId(s, 'TR'),
            ...form,
            status: 'Pending review',
            created: new Date().toISOString(),
          });
        }),

      confirmTransfer: (id) =>
        set((s) => {
          const x = s.transfers.find((t) => t.id === id);
          if (!x || x.status !== 'Pending review') return;
          x.status = 'Confirmed';
          s.wallet.available += x.amount;
          addTransaction(s, 'Bank transfer credited', x.amount, x.id);
        }),

      requestRefund: (form) =>
        set((s) => {
          if (!s.session) throw new Error('Please sign in to continue.');
          if (
            !Number.isSafeInteger(form.amount) ||
            form.amount <= 0 ||
            form.amount > s.wallet.available
          ) {
            throw new Error(
              'The refund amount must not exceed your available balance.',
            );
          }
          if (!form.reason.trim()) {
            throw new Error('Please tell us the reason for your refund request.');
          }
          s.refunds.unshift({
            id: newId(s, 'RF'),
            amount: form.amount,
            reason: form.reason,
            status: 'Pending review',
            created: new Date().toISOString(),
          });
        }),

      approveRefund: (id) =>
        set((s) => {
          const r = s.refunds.find((x) => x.id === id);
          if (!r || r.status !== 'Pending review') return;
          if (s.wallet.available < r.amount) {
            r.status = 'Insufficient funds';
            return;
          }
          s.wallet.available -= r.amount;
          s.wallet.frozen += r.amount;
          r.status = 'Approved — awaiting payment';
          addTransaction(s, 'Refund reserved', -r.amount, r.id);
        }),

      completeRefund: (id) =>
        set((s) => {
          const r = s.refunds.find((x) => x.id === id);
          if (!r || r.status !== 'Approved — awaiting payment') return;
          s.wallet.frozen -= r.amount;
          r.status = 'Paid';
          addTransaction(s, 'Offline refund paid', -r.amount, r.id);
        }),

      cancelRefund: (id) =>
        set((s) => {
          const r = s.refunds.find((x) => x.id === id);
          if (
            !r ||
            !['Pending review', 'Approved — awaiting payment'].includes(
              r.status,
            )
          ) {
            return;
          }
          if (r.status === 'Approved — awaiting payment') {
            s.wallet.frozen -= r.amount;
            s.wallet.available += r.amount;
            addTransaction(s, 'Refund reservation released', r.amount, r.id);
          }
          r.status = 'Cancelled';
        }),

      submitOrderReceipt: (orderId, form) =>
        set((s) => {
          if (!s.session) throw new Error('Please sign in to continue.');
          const o = s.orders.find((x) => x.id === orderId);
          if (!o || ['Cancelled', 'Completed'].includes(o.status)) {
            throw new Error('This order is not accepting payment details.');
          }
          const due = orderDue(o);
          if (
            !Number.isSafeInteger(form.amount) ||
            form.amount <= 0 ||
            form.amount > due ||
            !form.payer.trim() ||
            !form.ref.trim() ||
            !form.date ||
            !form.file
          ) {
            throw new Error('Check your payment amount, details and receipt.');
          }
          if (
            [...o.pending, ...o.receipts].some((x) => x.ref === form.ref)
          ) {
            throw new Error('This bank reference has already been submitted.');
          }
          o.pending.unshift({
            id: newId(s, 'PAY'),
            ...form,
            status: 'Pending review',
            created: new Date().toISOString(),
            date: form.date,
          });
        }),

      confirmOrderReceipt: (orderId, paymentId) =>
        set((s) => {
          const o = s.orders.find((x) => x.id === orderId);
          const p = o?.pending.find((x) => x.id === paymentId);
          if (!o || !p || p.status !== 'Pending review') return;
          if (p.amount > orderDue(o)) {
            p.status = 'Needs review';
            return;
          }
          p.status = 'Confirmed';
          o.paid += p.amount;
          o.pending = o.pending.filter((x) => x.id !== p.id);
          o.receipts.unshift(p);
          o.status =
            orderDue(o) === 0 ? 'Paid — awaiting delivery' : 'Partially paid';
          if (
            orderDue(o) === 0 &&
            o.source === 'Auction' &&
            !o.depositCredit &&
            s.registered.includes(o.vehicle)
          ) {
            const v = findVehicle(o.vehicle);
            if (v) {
              o.depositReleased = v.deposit;
              s.registrationRecords[o.vehicle] = {
                ...(s.registrationRecords[o.vehicle] || {
                  destination: v.country,
                  terms: 'Auction V1.1',
                  deposit: v.deposit,
                }),
                releasedAt: new Date().toISOString(),
              };
              s.registered = s.registered.filter((x) => x !== o.vehicle);
              s.wallet.frozen -= v.deposit;
              s.wallet.available += v.deposit;
              addTransaction(s, 'Deposit released', v.deposit, o.vehicle);
            }
          }
        }),

      applyWinningDeposit: (orderId) =>
        set((s) => {
          const o = s.orders.find((x) => x.id === orderId);
          if (
            !o ||
            o.source !== 'Auction' ||
            o.depositCredit ||
            !s.registered.includes(o.vehicle) ||
            o.status === 'Cancelled'
          ) {
            return;
          }
          const v = findVehicle(o.vehicle);
          if (!v) return;
          const credit = Math.min(orderDue(o), v.deposit);
          const released = v.deposit - credit;
          s.wallet.frozen -= v.deposit;
          s.registered = s.registered.filter((id) => id !== v.id);
          o.depositCredit = credit;
          if (credit) {
            addTransaction(s, 'Deposit applied to order', -credit, o.id);
          }
          if (released) {
            s.wallet.available += released;
            o.depositReleased = released;
            addTransaction(s, 'Deposit released', released, o.id);
          }
          o.status =
            o.status === 'Completed'
              ? 'Completed'
              : orderDue(o) === 0
                ? 'Paid — awaiting delivery'
                : o.paid
                  ? 'Partially paid'
                  : 'Awaiting payment';
        }),

      completeDelivery: (id) =>
        set((s) => {
          const o = s.orders.find((x) => x.id === id);
          if (!o || o.status !== 'Paid — awaiting delivery' || orderDue(o) !== 0)
            return;
          o.status = 'Completed';
          o.delivery = {
            date: new Date().toISOString(),
            receiver: s.user.name,
            method: 'Yard collection',
            reference: newId(s, 'DEL'),
            keys: 2,
          };
        }),

      updateProfile: (patch) =>
        set((s) => {
          Object.assign(s.user, patch);
        }),
    })),
    {
      name: STORAGE_KEY,
      version: DEMO_VERSION,
      migrate: () => createSeedState(),
    },
  ),
);

export { VEHICLES, findVehicle };
