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
};
