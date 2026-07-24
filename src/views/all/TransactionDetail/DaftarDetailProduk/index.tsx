import type { FC } from "react";
import type {
  ResponseStatistikKebutuhanBarang,
  ResponseTransactionType,
} from "../../../../models/transaction.model";
import type { ResponseStructure } from "../../../../types/response.type";
import { cn } from "../../../../utils/cn";
import { formatNumber, formatRupiah } from "../../../../helpers/helpers";
import RingkasanKredit from "../RingkasanKredit";
import useDaftarDetailProduk from "./useDaftarDetailProduk";
import CardForm from "../../../../components/inputs/CardForm";
import InputPrice from "../../../../components/inputs/InputPrice";
import type { UpdateHargaAndDiskonForRequestType } from "../../../../models/transactionDetail.model";
import ButtonUpdateTable from "../../../../components/ui/button/ButtonUpdateTable";
import AlertLabelList from "../../../../components/messages/AlertLabelList";
import { TRANSACTION_STATUS_TYPE } from "../../../../types/constant.type";
import AlertLabel from "../../../../components/messages/AlertLabel";

type Props = {
  isLoadingTransaction: boolean;
  isExistingDataTransaction: boolean;
  dataTransaction?: ResponseStructure<ResponseTransactionType | null>;
  isPageBookingKasir: boolean;
  isUbahData: boolean;
  dataKebutuhanBarang?: ResponseStructure<
    ResponseStatistikKebutuhanBarang[] | null
  >;
  isLoadingKebutuhanBarang?: boolean;
};
const DaftarDetailProduk: FC<Props> = ({
  dataTransaction,
  isExistingDataTransaction,
  isLoadingTransaction,
  isUbahData,
  dataKebutuhanBarang,
  isPageBookingKasir,
  isLoadingKebutuhanBarang,
}) => {
  const {
    isPendingUpdate,
    diskonController,
    hargaJualController,
    onSubmit,
    isFromActive,
    handleSetIsFromActive,
    handleSubmit,
    siapKirim,
    isExistDataKebutuhanBarang,
  } = useDaftarDetailProduk({
    transactionId: dataTransaction?.data?.id,
    dataKebutuhanBarang,
    isLoadingKebutuhanBarang,
  });

  return (
    <div className="flex-2 flex flex-col justify-start items-start gap-2.5">
      {/* detail produk */}
      <div
        className={cn(
          "w-full flex flex-col justify-start items-start rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm",
        )}
      >
        {/* data */}
        <div className="w-full flex flex-col justify-start items-start">
          <div className="overflow-x-auto w-full">
            <table className="table table-xs">
              {/* head */}
              <thead>
                <tr className="text-[0.625rem] bg-base-content/5 h-10">
                  <th>No</th>
                  <th>Gambar</th>
                  <th>Nama Produk</th>
                  <th>Harga (Rp)</th>
                  <th>Diskon (Rp)</th>
                  <th>Dipesan</th>
                  {dataTransaction?.data?.status ===
                    TRANSACTION_STATUS_TYPE.BOOKING && (
                    <>
                      <th>Stok Tersedia</th>
                      <th>Status</th>
                    </>
                  )}
                  <th>
                    <div className="flex justify-end items-end">
                      <span>Subtotal</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {isLoadingTransaction ? (
                  Array.from({ length: 4 }, (_, i) => i).map((item) => (
                    <tr key={item} className="h-18">
                      <td colSpan={7}>
                        <div className="w-full skeleton h-12" />
                      </td>
                    </tr>
                  ))
                ) : isExistingDataTransaction ? (
                  <>
                    {dataTransaction?.data?.details.map((item, index) => {
                      const kebutuhanBarang = dataKebutuhanBarang?.data?.find(
                        (kebutuhan) => kebutuhan.produk.id === item.id,
                      );

                      return (
                        <tr key={item.id} className="h-18 text-base-content">
                          <th className="px-3">{index + 1}</th>
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
                              <p className="xl:text-[0.7rem] text-base-content">
                                {item.produk.nama}
                              </p>
                              <span className="xl:text-[0.7rem] font-medium text-base-content/70">
                                {item.produk.kode}
                              </span>
                            </div>
                          </td>
                          <td>
                            {isFromActive?.detailId === item.id &&
                            isFromActive.hargaJual &&
                            isPageBookingKasir &&
                            isUbahData ? (
                              <CardForm<UpdateHargaAndDiskonForRequestType>
                                handleResetForm={() =>
                                  handleSetIsFromActive({ reset: true })
                                }
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                                isPending={false}
                                btnAksiPosition="top"
                              >
                                {/* input text */}
                                <div className="w-40">
                                  <InputPrice<UpdateHargaAndDiskonForRequestType>
                                    controller={hargaJualController}
                                    placeholder="harga jual produk"
                                    required
                                    xs
                                  />
                                </div>
                              </CardForm>
                            ) : (
                              <div className="flex flex-row justify-start items-center gap-1.5">
                                <span className="xl:text-[0.7rem] text-base-content">
                                  {/* harga jual */}
                                  {formatRupiah(item.hargaJual)}
                                </span>

                                {/* button pencil */}
                                {isPageBookingKasir && isUbahData && (
                                  <ButtonUpdateTable
                                    handleClick={() =>
                                      handleSetIsFromActive({
                                        detailId: item.id,
                                        hargaJual: {
                                          data: item.hargaJual,
                                        },
                                      })
                                    }
                                  />
                                )}
                              </div>
                            )}
                          </td>

                          <td>
                            {isFromActive?.detailId === item.id &&
                            isFromActive.diskon &&
                            isPageBookingKasir &&
                            isUbahData ? (
                              <CardForm<UpdateHargaAndDiskonForRequestType>
                                handleResetForm={() =>
                                  handleSetIsFromActive({ reset: true })
                                }
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                                isPending={isPendingUpdate}
                                btnAksiPosition="top"
                              >
                                {/* input text */}
                                <div className="w-30">
                                  <InputPrice<UpdateHargaAndDiskonForRequestType>
                                    controller={diskonController}
                                    placeholder="diskon"
                                    required
                                    xs
                                  />
                                </div>
                              </CardForm>
                            ) : (
                              <div className="flex flex-row justify-start items-center gap-1.5">
                                <span className="xl:text-[0.7rem] text-base-content">
                                  {formatRupiah(item.diskon)}
                                </span>

                                {/* button pencil */}
                                {isPageBookingKasir && isUbahData && (
                                  <ButtonUpdateTable
                                    handleClick={() =>
                                      handleSetIsFromActive({
                                        detailId: item.id,
                                        diskon: {
                                          data: item.diskon,
                                        },
                                      })
                                    }
                                  />
                                )}
                              </div>
                            )}
                          </td>
                          <td>
                            {" "}
                            <span className="xl:text-[0.7rem] text-base-content">
                              {/* qty */}
                              {formatNumber(item.quantity)} Pcs
                            </span>
                          </td>
                          {dataTransaction?.data?.status ===
                            TRANSACTION_STATUS_TYPE.BOOKING && (
                            <>
                              <td>
                                {" "}
                                <span className="xl:text-[0.7rem] text-base-content">
                                  {/* stok tersedia */}
                                  {formatNumber(
                                    kebutuhanBarang?.produk.stokTersedia ?? 0,
                                  )}{" "}
                                  Pcs
                                </span>
                              </td>

                              {/* status */}
                              <td>
                                {kebutuhanBarang?.siapKirim ? (
                                  <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-emerald-500 ">
                                    Cukup
                                  </span>
                                ) : (
                                  <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-rose-500 ">
                                    Kurang
                                  </span>
                                )}
                              </td>
                            </>
                          )}
                          <td>
                            <div className="flex flex-row justify-end items-end">
                              <span className="font-medium h-full flex flex-row justify-start items-start xl:text-[0.7rem] text-base-content">
                                {formatRupiah(
                                  item.hargaJual * item.quantity - item.diskon,
                                )}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    <tr>
                      <td
                        colSpan={
                          dataTransaction?.data?.status ===
                          TRANSACTION_STATUS_TYPE.BOOKING
                            ? 9
                            : 7
                        }
                      >
                        <div className="h-10 flex flex-row justify-between items-center">
                          <span className="text-xs font-medium text-base-content/80">
                            Total {dataTransaction?.data?.details.length} Item
                          </span>

                          {dataTransaction?.data?.status ===
                            TRANSACTION_STATUS_TYPE.BOOKING && (
                            <div className="flex flex-row justify-center items-center">
                              <div className="flex flex-row justify-start items-center gap-2.5">
                                <span className="text-[0.7rem] font-medium text-base-content">
                                  Total Barang Dibutuhkan :
                                </span>
                                <span className="text-[0.7rem] font-medium text-base-content">
                                  {formatNumber(
                                    dataKebutuhanBarang?.data?.reduce(
                                      (total, item) =>
                                        total +
                                        item.produk.stokBooking -
                                        item.produk.stokTersedia,
                                      0,
                                    ) ?? 0,
                                  )}{" "}
                                  Pcs
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end items-end">
                            <span className="text-xs font-semibold text-base-content">
                              {formatRupiah(
                                dataTransaction?.data?.totalBayar ?? 0,
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="w-full flex flex-row justify-center items-center pt-10">
                        <span className="text-sm text-base-content/70">
                          Produk tidak tersedia
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isExistDataKebutuhanBarang &&
        !isLoadingKebutuhanBarang &&
        !siapKirim && (
          <AlertLabel
            warning
            message="Masih terdapat barang yang kekurangan stok. Lengkapi stok terlebih dahulu sebelum menyelesaikan booking."
          />
        )}

      {/* transaksi booking */}
      {dataTransaction?.data?.status === TRANSACTION_STATUS_TYPE.BOOKING && (
        <AlertLabelList
          message={[
            "Uang Muka merupakan pembayaran awal saat booking dibuat.",
            "Dibayar adalah total pembayaran yang telah diterima dari pelanggan.",
            "Pada Metode Pembayaran Cash, Kembalian akan dihitung jika pembayaran melebihi total yang harus dibayar.",
            "Saat stok barang siap dikirim, lakukan penyesuaian harga, diskon, jumlah barang yang dikirim, serta total pembayaran sesuai kesepakatan dengan pelanggan sebelum transaksi diselesaikan.",
          ]}
        />
      )}

      {/* ringkasan kredit */}
      <RingkasanKredit
        dataTransaction={dataTransaction}
        isLoadingTransaction={isLoadingTransaction}
      />
    </div>
  );
};

export default DaftarDetailProduk;
