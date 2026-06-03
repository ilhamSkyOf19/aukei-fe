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
