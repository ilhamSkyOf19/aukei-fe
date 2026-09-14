export type CreateTransactionDetailOldType = {
  transactionDetailId: number;
  transactionId: number;
  produkId: number;
  namaProduk: string;
  kodeProduk?: string | null;
  quantity: number;
  hargaJual: number;
  totalHarga: number;
  diskon: number;
  subtotal: number;
  hpp?: number | null;
  laba?: number | null;
};

export type CreateTransactionDetailsOldType = CreateTransactionDetailOldType[];

export type ResponseTransactionDetailOldType = {
  id: number;
  transactionDetailId: number;
  transactionId: number;
  produkId: number;
  namaProduk: string;
  kodeProduk: string | null;
  quantity: number;
  hargaJual: number;
  totalHarga: number;
  diskon: number;
  subtotal: number;
  hpp: number | null;
  laba: number | null;
  createdAt: Date;
  updatedAt: Date;
};
