export type CreateShadowTransactionType = {
  shadowFeatureId: number;
  startDate: string;
  endDate: string;
};

export type ShadowTransactionDetailResponseType = {
  id: number;
  transactionDetailId: number;

  produkId: number;
  quantity: number;

  originalHargaJual: number;
  originalTotalHarga: number;
  originalDiskon: number;
  originalSubtotal: number;

  shadowHargaJual: number;
  shadowTotalHarga: number;
  shadowDiskon: number;
  shadowSubtotal: number;

  hpp: number | null;
  shadowLaba: number | null;
};

export type ShadowTempoResponseType = {
  id: number;
  tempoId: number;

  originalTotalTagihan: number;
  originalUangMuka: number;

  shadowTotalTagihan: number;
  shadowUangMuka: number;

  periode: number;
  jumlahCicilan: number;
  status: string;

  installments: ShadowTempoInstallmentResponseType[];
};

export type ShadowTransactionPaymentResponseType = {
  id: number;
  transactionPaymentId: number;

  jenis: string;
  metodePembayaran: string;

  originalDibayar: number;
  originalKembalian: number;
  originalNominal: number;

  shadowDibayar: number;
  shadowKembalian: number;
  shadowNominal: number;
};

export type ShadowTempoInstallmentResponseType = {
  id: number;
  tempoInstallmentId: number;

  cicilanKe: number;
  jatuhTempo: Date;

  originalNominal: number;
  shadowNominal: number;

  status: string;
  tanggalLunas: Date | null;

  payments: ShadowTempoPaymentResponseType[];
};

export type ShadowTempoPaymentResponseType = {
  id: number;
  tempoPaymentId: number;

  originalNominal: number;
  shadowNominal: number;

  metodePembayaran: string;
  tanggalBayar: Date;
  keterangan: string | null;
};

export type ShadowTransactionResponseType = {
  id: number;
  transactionId: number;
  shadowFeatureId: number;

  originalTotalDiskon: number;
  originalTotalBayar: number;
  originalTotalDiBayar: number;

  shadowTotalDiskon: number;
  shadowTotalBayar: number;
  shadowTotalDiBayar: number;

  ongkir: number;

  details: ShadowTransactionDetailResponseType[];
  payments: ShadowTransactionPaymentResponseType[];

  tempo: ShadowTempoResponseType | null;
};
export type ResponseCreateShadowTransactionType = {
  shadowFeatureId: number;

  startDate: Date;
  endDate: Date;

  totalTransaction: number;
  totalCreated: number;
  totalSkipped: number;

  transactions: ShadowTransactionResponseType[];
};

export type CreateShadowCutTransactionType = {
  shadowFeatureId: number;
  periode: number;
  customOmzet: number;
};
