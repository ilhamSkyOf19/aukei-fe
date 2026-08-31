import {
  ChevronRight,
  Minus,
  MoveLeft,
  Pencil,
  ShoppingCart,
  Trash2,
  UserRound,
} from "lucide-react";
import Avatar from "../../../../components/ui/Avatar";
import useDaftarKeranjang from "./useDaftarKeranjang";
import { formatNumberPhone, formatRupiah } from "../../../../helpers/helpers";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import ModalDelete from "../../../../components/modals/ModalDelete";
import { cn } from "../../../../utils/cn";

const DaftarKeranjang = () => {
  const {
    dataKeranjang,
    handleLanjutTransaksi,
    handleUbahKeranjang,
    isExistDataProduk,
    isLoadingKeranjang,
    subTotalBeforeDiskon,
    totalAfterDiskon,
    totalDiskon,
    handleDeleteKeranjang,
    isPendingDeleteKeranjang,
    handleCloseModalDeleteKeranjang,
    handleShowModalDeleteKeranjang,
    modalDeleteKeranjangRef,
    dataDeleteKeranjang,
    handleDeleteProdukInKeranjang,
    isPendingDeleteProdukInKeranjang,
  } = useDaftarKeranjang();

  return (
    <div className="w-full md:flex-6 h-full">
      {/* loading */}
      {isLoadingKeranjang ? (
        <div></div>
      ) : isExistDataProduk ? (
        <div className="w-full h-full flex flex-col lg:flex-row justify-start items-start gap-2.5">
          {/* ==================== BAGIAN KIRI ==================== */}
          <div className="w-full lg:flex-2 h-full flex flex-col justify-start items-start gap-2.5">
            {/* ==================== DATA PELANGGAN ==================== */}
            <div className="min-h-14 flex flex-row justify-between items-center w-full rounded-xl bg-base-100 border border-transparent dark:border-base-content/10 gap-2.5 shadow-sm p-2.5">
              {/* pelanggan */}
              <div className="min-w-0 flex flex-row justify-start items-center gap-2.5">
                {/* avatar */}
                <Avatar nama={dataKeranjang?.data?.pelanggan?.nama ?? ""} xs />

                <div className="min-w-0 flex flex-col justify-start items-start gap-0.5">
                  <span className="w-full truncate text-base-content text-xs font-medium">
                    {dataKeranjang?.data?.pelanggan?.nama ?? ""}
                  </span>

                  <span className="text-base-content/50 text-[0.625rem] font-medium">
                    {formatNumberPhone(
                      dataKeranjang?.data?.pelanggan?.noWa ?? "",
                    )}
                  </span>
                </div>
              </div>

              {/* kasir */}
              <div
                className={cn(
                  "shrink-0 w-auto flex flex-row justify-start items-center gap-2 h-10 min-w-28 px-2 rounded-xl border transition-all duration-300 ease-in-out border-base-content/10",
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 bg-base-300 border border-transparent dark:border-base-content/10 rounded-xl flex justify-center items-center",
                  )}
                >
                  <UserRound className={cn("size-4 text-base-content")} />
                </div>

                <div className="md:hidden flex flex-col justify-start items-start">
                  <span
                    className={cn(
                      "text-[0.625rem] text-base-content/50 font-medium",
                    )}
                  >
                    Kasir
                  </span>

                  <span className={cn("text-xs font-medium text-base-content")}>
                    {dataKeranjang?.data?.kasir?.nama ?? ""}
                  </span>
                </div>
              </div>
            </div>

            {/* ==================== DETAILS ==================== */}
            <div className="w-full lg:h-[90vh] flex flex-col justify-start items-start bg-base-100 border border-transparent dark:border-base-content/10 rounded-xl shadow-sm overflow-hidden">
              {/* table */}
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-custom-secondary w-full">
                <table className="table table-xs min-w-100">
                  {/* head */}
                  <thead>
                    <tr className="text-[0.7rem] bg-base-200 h-10">
                      <th>No</th>
                      <th>Gambar</th>
                      <th>Nama Produk</th>
                      <th>Harga (Rp)</th>
                      <th>Diskon (Rp)</th>
                      <th>Jumlah</th>
                      <th>Subtotal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dataKeranjang?.data?.details &&
                    dataKeranjang?.data?.details.length > 0 ? (
                      dataKeranjang?.data?.details.map((item, index) => (
                        <tr
                          key={item.id}
                          className="h-15 text-base-content text-[0.7rem]"
                        >
                          <th>{index + 1}</th>

                          {/* gambar */}
                          <td>
                            <div className="avatar">
                              <div className="mask mask-squircle h-10 w-10">
                                <img
                                  src={item.produk.img}
                                  alt="gambar produk"
                                />
                              </div>
                            </div>
                          </td>

                          {/* nama produk */}
                          <td>
                            <div className="flex flex-col justify-start items-start gap-px">
                              <p>{item.produk.nama}</p>

                              <span className="font-medium text-base-content/70">
                                {item.produk.kode}
                              </span>
                            </div>
                          </td>

                          {/* harga */}
                          <td>{formatRupiah(item.hargaJual)}</td>

                          {/* diskon */}
                          <td>{formatRupiah(item.diskon)}</td>

                          {/* quantity */}
                          <td>{item.quantity}</td>

                          {/* subtotal */}
                          <td>
                            <span className="font-medium text-base-content">
                              {formatRupiah(
                                item.hargaJual * item.quantity - item.diskon,
                              )}
                            </span>
                          </td>

                          {/* aksi */}
                          <td>
                            <button
                              type="button"
                              className="opacity-50 hover:opacity-100 transition-opacity duration-200 ease-in-out group p-px"
                              onClick={() =>
                                handleDeleteProdukInKeranjang({
                                  id: item.id,
                                })
                              }
                            >
                              {isPendingDeleteProdukInKeranjang ? (
                                <div className="loading loading-xs" />
                              ) : (
                                <Trash2 className="size-4 group-hover:text-error transition-colors duration-200 ease-in-out" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8}></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ==================== BUTTON UBAH KERANJANG ==================== */}
              <div className="w-full flex flex-row justify-end items-start border-t border-base-content/10 p-2.5">
                <ButtonWithIcon
                  icon={Pencil}
                  bgColor="bg-info"
                  textColor="text-primary-white"
                  label="Ubah Keranjang"
                  handleBtn={handleUbahKeranjang}
                />
              </div>
            </div>
          </div>

          {/* ==================== BAGIAN KANAN ==================== */}
          <div className="w-full lg:flex-1 flex flex-col justify-start items-end gap-2.5">
            {/* ==================== RINGKASAN ==================== */}
            <div className="w-full flex flex-col justify-start items-start gap-4 bg-base-100 border border-transparent dark:border-base-content/10 rounded-lg shadow-sm p-4">
              {/* sub total & total diskon */}
              <div className="w-full flex flex-col justify-start items-start gap-2.5 pb-2.5 border-b border-base-content/30 border-dashed">
                {/* total produk */}
                <div className="w-full flex flex-col justify-start items-start gap-2.5 pb-2.5 border-b border-dashed border-base-content/30">
                  {/* total produk */}
                  <div className="w-full flex flex-row justify-between items-center">
                    <span className="text-xs text-base-content/80">
                      Total Produk
                    </span>

                    <span className="text-xs font-semibold text-base-content">
                      {dataKeranjang?.data?.details.length ?? 0}
                    </span>
                  </div>

                  {/* total item */}
                  <div className="w-full flex flex-row justify-between items-center">
                    <span className="text-xs text-base-content/80">
                      Total Item
                    </span>

                    <span className="text-xs font-semibold text-base-content">
                      {dataKeranjang?.data?.details.reduce(
                        (total, item) => total + item.quantity,
                        0,
                      ) ?? 0}
                    </span>
                  </div>
                </div>

                {/* subtotal */}
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-xs text-base-content/80">Subtotal</span>

                  <span className="text-xs font-semibold text-base-content">
                    {formatRupiah(subTotalBeforeDiskon)}
                  </span>
                </div>

                {/* total diskon */}
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-xs text-base-content/80">
                    Total Diskon
                  </span>

                  <div className="flex flex-row justify-start items-center gap-1">
                    {totalDiskon > 0 && (
                      <span className="text-xs font-medium text-error">
                        <Minus className="size-2" />
                      </span>
                    )}

                    <span className="text-xs font-medium text-error">
                      {formatRupiah(totalDiskon)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ==================== TOTAL ==================== */}
              <div className="w-full flex flex-col justify-start items-start gap-3">
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-sm font-semibold text-base-content">
                    Total
                  </span>

                  <span className="text-sm font-semibold text-blue-500">
                    {formatRupiah(totalAfterDiskon)}
                  </span>
                </div>
              </div>
            </div>

            {/* ==================== BUTTON TRANSACTION ==================== */}
            <div className="w-full flex flex-col justify-end items-center gap-2.5">
              {/* hapus */}
              <ButtonWithIcon
                icon={Trash2}
                bgColor="bg-error"
                textColor="text-primary-white"
                label="Hapus"
                customWidth="w-full"
                isLoading={isPendingDeleteKeranjang}
                handleBtn={() =>
                  handleShowModalDeleteKeranjang(undefined, {
                    id: dataKeranjang?.data?.id,
                    pelanggan: {
                      id: dataKeranjang?.data?.pelanggan?.id,
                      nama: dataKeranjang?.data?.pelanggan?.nama,
                    },
                  })
                }
              />

              {/* transaksi */}
              <ButtonWithIcon
                icon={ChevronRight}
                label="Transaksi"
                reverse
                customWidth="w-full"
                handleBtn={() => handleLanjutTransaksi(dataKeranjang?.data?.id)}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ==================== EMPTY STATE ==================== */
        <div className="w-full h-[60vh] lg:h-[80vh] flex gap-2 flex-col justify-center items-center">
          <div className="flex flex-col justify-start items-center gap-4">
            {/* icon */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-base-200 flex flex-col justify-center items-center relative rounded-full">
              <UserRound className="size-20 sm:size-25 text-base-content" />

              <div className="w-10 h-10 absolute bottom-4 sm:bottom-6 right-2 sm:right-4 bg-base-100 shadow-sm rounded-full flex flex-col justify-center items-center">
                <ShoppingCart className="size-4 text-base-content" />
              </div>
            </div>

            {/* text */}
            <div className="flex flex-col justify-center items-center gap-4 px-4">
              <span className="font-medium text-base text-base-content text-center">
                Silahkan pilih pelanggan
              </span>

              <span className="text-sm text-base-content/50 text-center">
                Pilih pelanggan dari daftar di samping
                <br className="hidden sm:block" /> untuk melihat keranjang
              </span>
            </div>

            {/* arrow */}
            <MoveLeft className="hidden lg:block size-8" />
          </div>
        </div>
      )}

      {/* ==================== MODAL DELETE ==================== */}
      <ModalDelete
        modalRef={modalDeleteKeranjangRef}
        handleCloseModal={handleCloseModalDeleteKeranjang}
        handleDelete={handleDeleteKeranjang}
        highlightData={dataDeleteKeranjang?.pelanggan?.nama}
        bigTitle={
          dataDeleteKeranjang?.fromDetails
            ? "Produk yang dipilih merupakan item terakhir. Jika dihapus, seluruh keranjang pelanggan berikut juga akan terhapus. Lanjutkan?"
            : "Apakah Anda yakin ingin menghapus keranjang pelanggan berikut?"
        }
      />
    </div>
  );
};

export default DaftarKeranjang;
