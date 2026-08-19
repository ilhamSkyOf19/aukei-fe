export type Alert = {
  id: number;
  type: string;
  isAnimationOut: boolean;
};

export const ALERT_CONFIG_PRODUK: Record<
  string,
  {
    message: string;
  }
> = {
  cancel_delete_kategori: {
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
  expired: {
    message: "Mohon maaf, barang masuk sudah tidak dapat dibatalkan.",
  },
  gagal_cetak_invoice: {
    message:
      "Mohon maaf, gagal mencetak invoice. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
  gagal_download_invoice: {
    message:
      "Mohon maaf, gagal mendownload invoice. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
};

export const ALERT_CONFIG_BARANG_KELUAR_DETAIL: Record<
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
  empty_barang_keluar: {
    message:
      "Data Barang Keluar masih kosong, silahkan tambahkan barang keluar.",
  },
  expired: {
    message: "Mohon maaf, barang keluar sudah tidak dapat dibatalkan.",
  },
  stok_not_enough: {
    message: "Mohon maaf, stok tidak mencukupi.",
  },
  gagal_cetak_invoice: {
    message:
      "Mohon maaf, gagal mencetak invoice. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
  gagal_download_invoice: {
    message:
      "Mohon maaf, gagal mendownload invoice. Silahkan tunggu beberapa saat atau hubungi developer.",
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
  gagal_cetak_invoice: {
    message:
      "Mohon maaf, gagal mencetak invoice transaksi. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
  gagal_download_invoice: {
    message:
      "Mohon maaf, gagal mendownload invoice transaksi. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
};

export const ALERT_CONFIG_STATISTIK: Record<
  string,
  {
    message: string;
  }
> = {
  gagal_download: {
    message:
      "Mohon maaf, gagal mendownload laporan. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
};

export const ALERT_CONFIG_TRANSACTION_DETAIL: Record<
  string,
  {
    message: string;
  }
> = {
  gagal_download: {
    message:
      "Mohon maaf, gagal mendownload invoice. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
  gagal_cetak_invoice: {
    message:
      "Mohon maaf, gagal mencetak invoice. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
};

// transaksi pelanggan
export const ALERT_CONFIG_TRANSACTION_PELANGGAN: Record<
  string,
  {
    message: string;
  }
> = {
  gagal_download: {
    message:
      "Mohon maaf, gagal mendownload file. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
  gagal_cetak_invoice: {
    message:
      "Mohon maaf, gagal mencetak file. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
};

// alert installment detail
export const ALERT_CONFIG_INSTALLMENT_DETAIL: Record<
  string,
  {
    message: string;
  }
> = {
  gagal_download: {
    message:
      "Mohon maaf, gagal mendownload file. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
  gagal_cetak_invoice: {
    message:
      "Mohon maaf, gagal mencetak file. Silahkan tunggu beberapa saat atau hubungi developer.",
  },
};
