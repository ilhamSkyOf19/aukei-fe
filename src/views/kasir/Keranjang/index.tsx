import {
  ArrowBigLeftDash,
  ChevronRight,
  Minus,
  Package,
  Pencil,
  Phone,
  ShoppingBasketIcon,
  ShoppingCart,
  Tag,
  Trash2,
} from "lucide-react";
import Avatar from "../../../components/ui/Avatar";
import DataPelanggan from "./DataPelanggan";
import useKeranjang from "./useKeranjang";
import { formatNumberPhone, formatRupiah } from "../../../helpers/helpers";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";

const Keranjang = () => {
  // use call
  const {
    dataKeranjang,
    isExistDataProduk,
    isLoadingKeranjang,
    subTotalBeforeDiskon,
    totalAfterDiskon,
    totalDiskon,
    handleLanjutTransaksi,
  } = useKeranjang();

  return (
    <div className="w-full flex flex-row justify-between items-start p-4 gap-4 ">
      {/* left */}
      <div className="lg:flex-3 xl:flex-2 flex flex-col justify-start items-start gap-4">
        {/* daftar pelanggan */}
        <DataPelanggan />
      </div>

      <div className="flex-6 flex flex-col justify-start items-start gap-4">
        {isLoadingKeranjang ? (
          <div></div>
        ) : isExistDataProduk ? (
          <>
            {/* data pelanggan yang di pilih */}
            <div className="flex flex-row justify-start items-center w-full rounded-lg bg-base-100 gap-4 shadow-sm p-4">
              {/* avatar */}
              <Avatar nama={dataKeranjang?.data?.pelanggan?.nama ?? ""} xs />

              <div className="flex flex-col justify-start items-start gap-2">
                <span className="text-base-content text-sm font-medium">
                  {dataKeranjang?.data?.pelanggan?.nama ?? ""}
                </span>
                <div className="flex flex-row justify-start items-center gap-2">
                  <Phone className="size-3 text-base-content/50" />
                  <span className="text-base-content/50 text-xs font-semibold">
                    {formatNumberPhone(
                      dataKeranjang?.data?.pelanggan?.noWa ?? "",
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* details */}
            <div className="w-full flex flex-col justify-start items-start gap-4 bg-base-100 rounded-lg shadow-sm p-4">
              {/* header */}
              <h3 className="text-base-content text-sm font-semibold">
                Daftar Produk
              </h3>
              <div className="overflow-x-auto w-full pb-2">
                <table className="table table-xs">
                  {/* head */}
                  <thead className="bg-base-content/5 h-10">
                    <tr className="text-[0.625rem]">
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
                        <tr key={index} className="h-15">
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
                              <span className="font-medium text-base-content/50">
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
                              onClick={() => {}}
                            >
                              <Trash2 className="size-4 group-hover:text-error transition-color duration-200 ease-in-out" />
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
              <div className="w-full flex flex-row justify-end items-start border-t border-base-content/10 pt-4">
                <ButtonWithIcon
                  icon={Pencil}
                  bgColor="bg-info"
                  textColor="text-primary-white"
                  label="Ubah Keranjang"
                />
              </div>
            </div>

            <div className="w-full flex flex-col justify-start items-end gap-4">
              <div className="w-100 flex flex-col justify-start items-start gap-4 bg-base-100 rounded-lg shadow-sm p-4">
                {/* sub total & total diskon */}
                <div className="w-full flex flex-col justify-start items-start gap-3 pb-4 border-b border-base-content/10">
                  {/* total item */}
                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-row justify-start items-center gap-4">
                      {/* icon */}
                      <Package className="size-4 text-base-content/60" />
                      <span className="text-xs font-semibold text-base-content/60">
                        Total Item
                      </span>
                    </div>
                    <span className="text-xs font-medium text-base-content">
                      {dataKeranjang?.data?.details.length}
                    </span>
                  </div>

                  {/* sub total */}
                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-row justify-start items-center gap-4">
                      {/* icon */}
                      <ShoppingBasketIcon className="size-4 text-base-content/60" />
                      <span className="text-xs font-semibold text-base-content/60">
                        Subtotal
                      </span>
                    </div>
                    <span className="text-xs font-medium text-base-content">
                      {formatRupiah(subTotalBeforeDiskon)}
                    </span>
                  </div>

                  {/* total diskon */}
                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-row justify-start items-center gap-4">
                      {/* icon */}
                      <Tag className="size-4 text-base-content/60" />
                      <span className="text-xs font-semibold text-base-content/60">
                        Total Diskon
                      </span>
                    </div>
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
                    <div className="flex flex-row justify-start items-center gap-4">
                      {/* icon */}
                      <ShoppingCart className="size-4 text-base-content/60" />
                      <span className="text-xs font-semibold text-base-content/60">
                        Total
                      </span>
                    </div>
                    <span className="text-sm font-medium text-blue-400">
                      {formatRupiah(totalAfterDiskon)}
                    </span>
                  </div>
                </div>
              </div>

              {/* button transaction */}
              <div className="w-100 flex flex-row justify-end items-center">
                <ButtonWithIcon
                  icon={ChevronRight}
                  label="Lanjut ke Transaksi"
                  reverse
                  customWidth="w-[50%]"
                  handleBtn={handleLanjutTransaksi}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-[50vh] flex gap-2 flex-col justify-center items-center">
            <ArrowBigLeftDash className="size-10 text-base-content" />
            <span className="text-base-content font-medium">
              Silahkan pilih pelanggan
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Keranjang;
