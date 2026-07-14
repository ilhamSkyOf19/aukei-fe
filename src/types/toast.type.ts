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
    message: "Kategori produk berhasil diperbarui",
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
    message: "Produk berhasil diperbarui",
  },
  deleted_produk: {
    color: "error",
    message: "Produk berhasil dihapus",
  },
  updated_status: {
    color: "info",
    message: "Status berhasil diperbarui",
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
    message: "Produk berhasil diperbarui",
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
    message: "Barang masuk berhasil diperbarui",
  },
  deleted_barang_masuk: {
    color: "error",
    message: "Barang masuk berhasil dihapus",
  },
};

// toast barang keluar
export const TOAST_CONFIG_BARANG_KELUAR: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  updated_barang_keluar: {
    color: "info",
    message: "Barang masuk berhasil diperbarui",
  },
  deleted_barang_keluar: {
    color: "error",
    message: "Barang masuk berhasil dihapus",
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
  created_barang_masuk: {
    color: "success",
    message: "Barang masuk berhasil ditambahkan",
  },
  barang_masuk_detail_add_success: {
    color: "success",
    message: "Barang berhasil ditambahkan",
  },
  deleted_barang_masuk_detail: {
    color: "error",
    message: "Barang berhasil dihapus",
  },
  updated_barang_masuk_detail: {
    color: "info",
    message: "Barang berhasil diperbarui",
  },
  posted: {
    color: "success",
    message: "Barang masuk berhasil diposting",
  },
  cancel_posted: {
    color: "error",
    message: "Barang masuk berhasil dibatalkan",
  },
  updated_tanggalMasuk: {
    color: "info",
    message: "Tanggal masuk berhasil diperbarui",
  },
  updated_keterangan: {
    color: "info",
    message: "Keterangan barang berhasil diperbarui",
  },
  approved_pengajuan: {
    color: "success",
    message: "Barang masuk berhasil disetujui",
  },
  canceled_verifikasi: {
    color: "error",
    message: "Verifikasi berhasil dibatalkan",
  },
  rejected_verifikasi: {
    color: "error",
    message: "Verifikasi berhasil ditolak",
  },
};

export const TOAST_CONFIG_BARANG_KELUAR_DETAIL: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  created_barang_keluar: {
    color: "success",
    message: "Barang keluar berhasil ditambahkan",
  },
  barang_keluar_detail_add_success: {
    color: "success",
    message: "Barang berhasil ditambahkan",
  },
  deleted_barang_keluar_detail: {
    color: "error",
    message: "Barang berhasil dihapus",
  },
  updated_barang_keluar_detail: {
    color: "info",
    message: "Barang berhasil diperbarui",
  },
  posted: {
    color: "success",
    message: "Barang keluar berhasil diposting",
  },
  cancel_posted: {
    color: "error",
    message: "Barang keluar berhasil dibatalkan",
  },
  updated_tanggalKeluar: {
    color: "info",
    message: "Tanggal keluar berhasil diperbarui",
  },
  updated_keterangan: {
    color: "info",
    message: "Keterangan barang berhasil diperbarui",
  },
  approved_pengajuan: {
    color: "success",
    message: "Barang keluar berhasil disetujui",
  },
  canceled_verifikasi: {
    color: "error",
    message: "Verifikasi berhasil dibatalkan",
  },
  rejected_verifikasi: {
    color: "error",
    message: "Verifikasi berhasil ditolak",
  },
};

// toast pegawai
export const TOAST_CONFIG_PEGAWAI: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  updated_pegawai: {
    color: "info",
    message: "Pegawai berhasil diperbarui",
  },
  created_pegawai: {
    color: "success",
    message: "Pegawai berhasil dibuat",
  },
  deleted_pegawai: {
    color: "error",
    message: "Pegawai berhasil dihapus",
  },
  updated_status: {
    color: "info",
    message: "Status berhasil diperbarui",
  },
};

// toast pelanggan
export const TOAST_CONFIG_PELANGGAN: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  updated_pelanggan: {
    color: "info",
    message: "Pelanggan berhasil diperbarui",
  },
  created_pelanggan: {
    color: "success",
    message: "Pelanggan berhasil dibuat",
  },
  deleted_pelanggan: {
    color: "error",
    message: "Pelanggan berhasil dihapus",
  },
  updated_status: {
    color: "info",
    message: "Status berhasil diperbarui",
  },
};

// toast transaction
export const TOAST_CONFIG_TRANSACTION: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  created_transaction: {
    color: "success",
    message: "Transaksi berhasil dibuat",
  },
  updated_transaction: {
    color: "success",
    message: "Transaksi berhasil diperbarui",
  },
  simpan_keranjang: {
    color: "success",
    message: "Data berhasil di simpan ke keranjang",
  },
  created_pelanggan: {
    color: "success",
    message: "Pelanggan berhasil ditambahkan",
  },
  set_tempo: {
    color: "success",
    message: "Tempo berhasil diatur",
  },
};

// toast keranjang
export const TOAST_CONFIG_KERANJANG: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  updated_keranjang: {
    color: "success",
    message: "Keranjang berhasil diperbarui",
  },
  deleted_keranjang: {
    color: "error",
    message: "Keranjang berhasil dihapus",
  },
};
