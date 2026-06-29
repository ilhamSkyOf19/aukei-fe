// role internal
export const ROLE_INTERNAL_TYPE = {
  OWNER: "OWNER",
  KASIR: "KASIR",
} as const;

// type role
export type RoleInternalType =
  (typeof ROLE_INTERNAL_TYPE)[keyof typeof ROLE_INTERNAL_TYPE];

// status barang masuk
export const STATUS_INVENTORI_TYPE = {
  DRAFT: "DRAFT",
  POSTED: "POSTED",
} as const;

// type status barang masuk
export type StatusInventoriType =
  (typeof STATUS_INVENTORI_TYPE)[keyof typeof STATUS_INVENTORI_TYPE];

export const JENIS_NOTIFIKASI_PRODUK_TYPE = {
  STOK_MINUS: "STOK_MINUS",
  STOK_EMPTY: "STOK_EMPTY",
  STOK_MINIMUM: "STOK_MINIMUM",
} as const;

export type JenisNotifikasiProdukType =
  (typeof JENIS_NOTIFIKASI_PRODUK_TYPE)[keyof typeof JENIS_NOTIFIKASI_PRODUK_TYPE];

// payment method
export const PAYMENT_METHOD_TYPE = {
  CASH: "CASH",
  QRIS: "QRIS",
  TRANSFER: "TRANSFER",
  TEMPO: "TEMPO",
} as const;

export type PaymentMethodType =
  (typeof PAYMENT_METHOD_TYPE)[keyof typeof PAYMENT_METHOD_TYPE];

// tempo status
export const TEMPO_STATUS_TYPE = {
  UNPAID: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
} as const;

export type TempoStatusType =
  (typeof TEMPO_STATUS_TYPE)[keyof typeof TEMPO_STATUS_TYPE];

// installment status
export const INSTALLMENT_STATUS_TYPE = {
  UNPAID: "UNPAID",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
} as const;

export type InstallmentStatusType =
  (typeof INSTALLMENT_STATUS_TYPE)[keyof typeof INSTALLMENT_STATUS_TYPE];

// status transaction
export const TRANSACTION_STATUS_TYPE = {
  CART: "CART",
  COMPLETED: "COMPLETED",
} as const;

export type TransactionStatusType =
  (typeof TRANSACTION_STATUS_TYPE)[keyof typeof TRANSACTION_STATUS_TYPE];

// outlet context type
export type OutletContextType = {
  handleTitle: (title: string) => void;
};

// meta type
// pagination
export interface MetaType {
  totalData: number;
  currentPage: number;
  totalPage: number;
  limit: number;
}

// max file size 2 MB
export const MAX_FILE_SIZE_IMG = 3 * 1024 * 1024;
