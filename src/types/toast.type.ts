export type Toast = {
  id: number;
  type: string;
  isAnimationOut: boolean;
};

export const TOAST_CONFIG_KATEGORI_PRODUK: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  created: {
    color: "success",
    message: "Kategori produk berhasil ditambahkan",
  },
  updated: {
    color: "info",
    message: "Kategori produk berhasil diubah",
  },
  deleted: {
    color: "error",
    message: "Kategori produk berhasil dihapus",
  },
};

// toast produk
export const TOAST_CONFIG_PRODUK: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  updated_produk: {
    color: "info",
    message: "Produk berhasil diubah",
  },
};

// toast produk detail
export const TOAST_CONFIG_PRODUK_DETAIL: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  updated_produk: {
    color: "info",
    message: "Produk berhasil diubah",
  },
};
