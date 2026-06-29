export type Alert = {
  id: number;
  type: string;
  isAnimationOut: boolean;
};

export const ALERT_CONFIG_KATEGORI_PRODUK: Record<
  string,
  {
    message: string;
  }
> = {
  cancel_delete: {
    message:
      "Kategori Produk tidak dapat dihapus karena masih digunakan oleh Produk.",
  },
};

export const ALERT_CONFIG_BARANG_MASUK_DETAIL: Record<
  string,
  {
    message: string;
  }
> = {
  produk_choose_exist: {
    message: "Produk sudah dipilih, silahkan pilih produk lain.",
  },
  produk_choose_exist_in_data: {
    message: "Produk sudah ada dalam data, silahkan pilih produk lain.",
  },
  empty_barang_masuk: {
    message: "Data Barang Masuk masih kosong, silahkan tambahkan barang masuk.",
  },
};

export const ALERT_CONFIG_TRANSACTION: Record<
  string,
  {
    message: string;
  }
> = {
  transaksi_kosong: {
    message: "Data transaksi masih kosong, silahkan tambahkan transaksi.",
  },
  pelanggan_kosong: {
    message: "Data pelanggan masih kosong, silahkan tambahkan pelanggan.",
  },
  existing_keranjang: {
    message:
      "Pelanggan sudah memiliki keranjang, silahkan pilih pelanggan lain.",
  },
};
