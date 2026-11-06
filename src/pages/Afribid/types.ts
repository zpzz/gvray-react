export type AfribidLang = 'en' | 'fr' | 'ar' | 'es';

export type VehicleMode = 'auction' | 'direct';

export type VehicleStatus =
  | 'Live'
  | 'Upcoming'
  | 'Available'
  | 'Reserved'
  | 'Sold'
  | 'Ended'
  | 'Cancelled'
  | 'Paused';

export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  body: string;
  mode: VehicleMode;
  status: VehicleStatus | string;
  country: string;
  city: string;
  mileage: number;
  fuel: string;
  steering: string;
  transmission: string;
  engine: string;
  drive: string;
  colour: string;
  seats: number;
  price: number | null;
  startPrice?: number;
  step?: number;
  deposit: number;
  photos: string[];
  condition: string;
  saleCountries: string[];
  vin: string;
  firstRegistration: string;
  starts?: string;
}

export interface BidHistoryItem {
  who: string;
  amount: number;
  time: string;
}

export interface AuctionRuntime {
  price: number;
  leader: string;
  bids: number;
  end: number;
  phase: 'Live' | 'Paused' | 'Ended' | 'Cancelled';
  mine: number;
  history: BidHistoryItem[];
  extended?: boolean;
  pauseRemaining?: number;
}

export interface AfribidUser {
  id: string;
  name: string;
  type: 'Individual' | 'Company' | string;
  company: string;
  email: string;
  phone: string;
  country: string;
  status: 'Verified' | 'Pending review' | 'Restricted' | 'Suspended' | string;
  terms: string;
  accepted: string | null;
}

export interface Wallet {
  available: number;
  frozen: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  vehicle: string;
  date: string;
  status: string;
}

export interface RegistrationRecord {
  destination: string;
  terms: string;
  acceptedAt?: string;
  deposit: number;
  releasedAt?: string;
}

export interface InquiryMessage {
  from: string;
  text: string;
  date: string;
  key: boolean;
}

export interface Quote {
  id: string;
  vehicle: number;
  service: number;
  docs: number;
  transport: number;
  insurance: number;
  total: number;
  deposit: number;
  expires: number;
  paymentDue: string;
  country: string;
  location: string;
}

export interface Inquiry {
  id: string;
  vehicle: string;
  type: 'Inquiry' | 'Purchase intent' | string;
  status: string;
  amount: number | null;
  snapshot?: number | null;
  country: string;
  location: string;
  paymentDate: string;
  created: string;
  messages: InquiryMessage[];
  quote: Quote | null;
  quoteHistory?: Quote[];
  order?: string;
}

export interface OrderReceipt {
  id: string;
  amount: number;
  date: string;
  status: string;
  ref: string;
  payer?: string;
  file?: string;
  created?: string;
}

export interface OrderDelivery {
  date: string;
  receiver: string;
  method: string;
  carrier?: string;
  reference: string;
  keys: number;
}

export interface Order {
  id: string;
  vehicle: string;
  source: 'Auction' | 'Direct sale' | string;
  status: string;
  price: number;
  service: number;
  docs: number;
  transport: number;
  insurance: number;
  total: number;
  depositCredit: number;
  paid: number;
  pending: OrderReceipt[];
  due: string;
  country: string;
  location: string;
  created: string;
  terms: string;
  receipts: OrderReceipt[];
  delivery: OrderDelivery | null;
  quoteId?: string;
  requiredDeposit?: number;
  depositReleased?: number;
}

export interface Transfer {
  id: string;
  amount: number;
  payer: string;
  ref: string;
  date: string;
  file: string;
  status: string;
  created: string;
}

export interface Refund {
  id: string;
  amount: number;
  reason: string;
  status: string;
  created: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  route: string;
}

export interface HomeSale {
  id: string;
  name: string;
  city: string;
  country: string;
  price: number;
  photo: string;
}

export interface AfribidState {
  version: number;
  lang: AfribidLang;
  timezone: string;
  session: boolean;
  onboarded: boolean;
  user: AfribidUser;
  wallet: Wallet;
  registered: string[];
  registrationRecords: Record<string, RegistrationRecord>;
  watchlist: string[];
  transactions: Transaction[];
  transfers: Transfer[];
  refunds: Refund[];
  inquiries: Inquiry[];
  orders: Order[];
  notifications: NotificationItem[];
  auctions: Record<string, AuctionRuntime>;
  support: unknown[];
  seq: number;
  disconnected?: boolean;
}
