export type Toast = {
  id: number;
  type: string;
  isAnimationOut: boolean;
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
  updated_harga_jual_produk: {
    color: "info",
    message: "Harga Jual Produk berhasil diperbarui",
  },
  deleted_produk: {
    color: "error",
    message: "Produk berhasil dihapus",
  },
  updated_status: {
    color: "info",
    message: "Status berhasil diperbarui",
  },
  created_kategori: {
    color: "success",
    message: "Kategori produk berhasil ditambahkan",
  },
  updated_kategori: {
    color: "info",
    message: "Kategori produk berhasil diperbarui",
  },
  deleted_kategori: {
    color: "error",
    message: "Kategori produk berhasil dihapus",
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
  updated_status: {
    color: "info",
    message: "Status berhasil diperbarui",
  },
  updated_harga_jual_produk: {
    color: "info",
    message: "Harga Jual Produk berhasil diperbarui",
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
  send_pengajuan: {
    color: "success",
    message: "Pengajuan berhasil dikirim, silahkan menunggu verifikasi",
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
  send_pengajuan: {
    color: "success",
    message: "Pengajuan berhasil dikirim, silahkan menunggu verifikasi",
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
    color: "info",
    message: "Data berhasil diperbarui",
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
  update_stok_dikirim: {
    color: "info",
    message: "stok dikirim berhasil diperbarui",
  },
  cancelled: {
    color: "error",
    message: "transaksi berhasil dibatalkan",
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

// toast daftar retur barang
export const TOAST_CONFIG_RETUR_BARANG: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  created_retur_barang: {
    color: "success",
    message: "Data retur berhasil disimpan dan diajukan ke owner.",
  },
  deleted_retur_barang: {
    color: "error",
    message: "Data retur berhasil dihapus",
  },
};

// toast daftar retur barang detail
export const TOAST_CONFIG_RETUR_BARANG_DETAIL: Record<
  string,
  {
    message: string;
    color: "success" | "error" | "info" | "warning" | "neutral";
  }
> = {
  created_retur_barang_kasir: {
    color: "success",
    message: "Data retur berhasil disimpan dan diajukan ke owner.",
  },
  updated_retur_barang_kasir: {
    color: "success",
    message: "Data retur berhasil disimpan dan diajukan ke owner.",
  },
  created_retur_barang_owner: {
    color: "success",
    message: "Data retur berhasil disimpan, silahkan verifikasi ulang.",
  },
  updated_retur_barang_owner: {
    color: "info",
    message: "Data retur berhasil diperbarui, silahkan verifikasi ulang.",
  },
  rejected_verifikasi: {
    color: "error",
    message: "Verifikasi berhasil ditolak",
  },
  approved_pengajuan: {
    color: "success",
    message: "Verifikasi berhasil disetujui",
  },
  deleted_retur_barang: {
    color: "error",
    message: "Data retur berhasil dihapus",
  },
};
