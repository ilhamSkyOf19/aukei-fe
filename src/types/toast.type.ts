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
  created_produk: {
    color: "success",
    message: "Produk berhasil ditambahkan",
  },
  updated_produk: {
    color: "info",
    message: "Produk berhasil diubah",
  },
  deleted_produk: {
    color: "error",
    message: "Produk berhasil dihapus",
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

// toast barang masuk
export const TOAST_CONFIG_BARANG_MASUK: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  updated_barang_masuk: {
    color: "info",
    message: "Produk berhasil diubah",
  },
  created_barang_masuk: {
    color: "info",
    message: "Produk berhasil diubah",
  },
};

// toast barang masuk detaik
export const TOAST_CONFIG_BARANG_MASUK_DETAIL: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  barang_masuk_detail_add_success: {
    color: "success",
    message: "Barang berhasil ditambahkan",
  },
  deleted_barang_masuk_detail: {
    color: "error",
    message: "Barang berhasil dihapus",
  },
  posted: {
    color: "success",
    message: "Barang masuk berhasil diposting",
  },
  cancel_posted: {
    color: "error",
    message: "Barang masuk berhasil dibatalkan",
  },
};
