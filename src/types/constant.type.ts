import {
  Ban,
  CircleCheckBig,
  CircleX,
  Clock3,
  FilePenLine,
  type LucideIcon,
} from "lucide-react";

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
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
  POSTED: "POSTED",
} as const;

export const TRANSACTION_PAYMENT_STATUS_TYPE = {
  TEMPO_DP: "TEMPO_DP",
  BOOKING_DP: "BOOKING_DP",
  PELUNASAN: "PELUNASAN",
  REFUND: "REFUND",
} as const;

export type TransactionPaymentStatusType =
  (typeof TRANSACTION_PAYMENT_STATUS_TYPE)[keyof typeof TRANSACTION_PAYMENT_STATUS_TYPE];

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
  BOOKING: "BOOKING",
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

export type ErrorType =
  | "METODE_PEMBAYARAN_KOSONG"
  | "DATA_DI_BAYAR_KOSONG"
  | "DATA_TEMPO_KOSONG";

export const STATUS_PERGERAKAN = {
  CEPAT: "CEPAT",
  NORMAL: "NORMAL",
  LAMBAT: "LAMBAT",
} as const;

export type StatusPergerakan =
  (typeof STATUS_PERGERAKAN)[keyof typeof STATUS_PERGERAKAN];

export const BATAS_WAKTU_BATALKAN_POSTING_MS = 2 * 60 * 1000;

export const inventoryNotification: Record<
  StatusInventoriType,
  {
    title: string;
    description: string;
    color: string;
    bg: string;
    bullet: string;
    icon: LucideIcon;
  }
> = {
  DRAFT: {
    title: "Pengajuan Draft",
    description: "Pengajuan masih berupa draft.",
    color: "text-blue-500",
    bg: "bg-blue-50",
    bullet: "status-custom-blue",
    icon: FilePenLine,
  },

  PENDING: {
    title: "Menunggu Persetujuan",
    description: "Pengajuan barang menunggu persetujuan.",
    color: "text-amber-500",
    bg: "bg-amber-50",
    bullet: "status-custom-yellow",
    icon: Clock3,
  },

  POSTED: {
    title: "Pengajuan Disetujui",
    description: "Pengajuan berhasil diproses.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    bullet: "status-custom-green",
    icon: CircleCheckBig,
  },

  REJECTED: {
    title: "Pengajuan Ditolak",
    description: "Pengajuan barang ditolak.",
    color: "text-rose-500",
    bg: "bg-rose-50",
    bullet: "status-custom-red",
    icon: CircleX,
  },

  CANCELLED: {
    title: "Pengajuan Dibatalkan",
    description: "Pengajuan dibatalkan.",
    color: "text-gray-500",
    bg: "bg-gray-50",
    bullet: "",
    icon: Ban,
  },
} as const;
