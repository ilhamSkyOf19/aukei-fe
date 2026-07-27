import {
  ChevronRight,
  Minus,
  MoveLeft,
  Package,
  Pencil,
  ShoppingBasketIcon,
  ShoppingCart,
  Tag,
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
    <div className="w-full flex-6 h-full">
      {/* buat loading */}
      {isLoadingKeranjang ? (
        <div></div>
      ) : isExistDataProduk ? (
        <div className="w-full h-full flex flex-row justify-start items-start gap-2.5">
          <div className="flex-2 h-full flex flex-col justify-start items-start gap-2.5">
            {/* data pelanggan yang di pilih */}
            <div className="h-14 flex flex-row justify-start items-center w-full rounded-xl bg-base-100 border border-transparent dark:border-base-content/10 gap-2.5 shadow-sm p-2.5">
              <div className="w-full flex flex-row justify-start items-center gap-2.5">
                {/* avatar */}
                <Avatar nama={dataKeranjang?.data?.pelanggan?.nama ?? ""} xs />

                <div className="flex flex-col justify-start items-start gap-0.5">
                  <span className="text-base-content text-xs font-medium">
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
                  "flex flex-row justify-start items-center gap-2 h-10 min-w-28 px-2 rounded-xl border transition-all duration-300 ease-in-out border-base-content/10",
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 bg-base-300 border border-transparent  dark:border-base-content/10 rounded-xl flex justify-center items-center",
                  )}
                >
                  <UserRound className={cn("size-4 text-base-content")} />
                </div>
                <div className="flex flex-col justify-start items-start">
                  <span
                    className={cn(
                      "text-[0.625rem] text-base-content/50 font-medium",
                    )}
                  >
                    Kasir
                  </span>
                  <span className={cn("text-xs font-mediumtext-base-content")}>
                    {dataKeranjang?.data?.kasir?.nama ?? ""}
                  </span>
                </div>
              </div>
            </div>

            {/* details */}
            <div className="w-full h-[80vh] flex-3 flex flex-col justify-start items-start bg-base-100 border border-transparent dark:border-base-content/10 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-custom-secondary w-full pb-2">
                <table className="table table-xs">
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
                    {/* row 1 */}
                    {dataKeranjang?.data?.details &&
                    dataKeranjang?.data?.details.length > 0 ? (
                      dataKeranjang?.data?.details.map((item, index) => (
                        <tr
                          key={index}
                          className="h-15 text-base-content text-[0.7rem]"
                        >
                          <th>{index + 1}</th>
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
                          <td>
                            <div className="flex flex-col justify-start items-start gap-px">
                              <p>{item.produk.nama}</p>
                              <span className="font-medium text-base-content/70">
                                {item.produk.kode}
                              </span>
                            </div>
                          </td>
                          <td>{formatRupiah(item.hargaJual)}</td>
                          <td>{formatRupiah(item.diskon)}</td>
                          <td>{item.quantity}</td>
                          <td>
                            <span className="font-medium text-base-content">
                              {formatRupiah(
                                item.hargaJual * item.quantity - item.diskon,
                              )}
                            </span>
                          </td>
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
                                <div className="loading-xs" />
                              ) : (
                                <Trash2 className="size-4 group-hover:text-error transition-color duration-200 ease-in-out" />
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

              {/* button ubah keranjang */}
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

          <div className="flex-1 flex flex-col justify-start items-end gap-2.5">
            <div className="w-full flex flex-col justify-start items-start gap-4 bg-base-100 border border-transparent dark:border-base-content/10 rounded-lg shadow-sm p-4">
              {/* sub total & total diskon */}
              <div className="w-full flex flex-col justify-start items-start gap-2.5 pb-2.5 border-b border-base-content/30 border-dashed">
                {/* total produk */}
                <div className="w-full flex flex-col justify-start items-start gap-2.5 pb-2.5 border-b border-dashed border-base-content/30">
                  <div className="w-full flex flex-row justify-between items-center">
                    <span className="text-xs text-base-content/80">
                      Total Produk
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {dataKeranjang?.data?.details.length}
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
                      )}
                    </span>
                  </div>
                </div>

                {/* sub total */}
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

              {/* total */}
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

            {/* button transaction */}
            <div className="w-full flex flex-row justify-end items-center gap-2.5">
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
        <div className="w-full h-[80vh] flex gap-2 flex-col justify-center items-center">
          <div className="flex flex-col justify-start items-center gap-4">
            {/* icon */}
            <div className="w-40 h-40 bg-base-200 flex flex-col justify-center items-center relative rounded-full">
              {/* icon */}
              <UserRound className="size-25 text-base-content" />
              {/* icon cart */}
              <div className="w-10 h-10 absolute bottom-6 right-4 bg-base-100 shadow-sm rounded-full flex flex-col justify-center items-center">
                <ShoppingCart className="size-4 text-base-content" />
              </div>
            </div>

            {/* text */}
            <div className="flex flex-col justify-center items-center gap-4">
              <span className="font-medium text-base text-base-content">
                Silahkan pilih pelanggan
              </span>
              <span className="text-sm text-base-content/50 text-center">
                Pilih pelanggan dari daftar di samping <br /> untuk melihat
                keranjang
              </span>
            </div>

            {/* arrow */}
            <MoveLeft className="size-8" />
          </div>
        </div>
      )}

      {/* use modal delete */}
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
