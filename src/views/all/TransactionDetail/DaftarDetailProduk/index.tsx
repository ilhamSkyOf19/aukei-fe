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
import ButtonUpdateTable from "../../../../components/ui/button/ButtonUpdateTable";
import AlertLabelList from "../../../../components/messages/AlertLabelList";
import {
  PAYMENT_METHOD_TYPE,
  ROLE_INTERNAL_TYPE,
  TRANSACTION_STATUS_TYPE,
  type RoleInternalType,
} from "../../../../types/constant.type";
import AlertLabel from "../../../../components/messages/AlertLabel";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Eye,
  PackagePlus,
  Pencil,
  PencilLine,
  Undo,
  X,
} from "lucide-react";
import CardProdukTransaksi from "../../../../components/ui/cards/CardProdukTransaksi";
import DataEmpty from "../../../../components/messages/DataEmpty";
import LoadingFetch from "../../../../components/ui/LoadingFetch";
import ButtonDeleteTable from "../../../../components/ui/button/ButtonDeleteTable";
import ModalFormulirTransaksi from "../../../../components/modals/ModalFormulirTransaksi";
import ModalDelete from "../../../../components/modals/ModalDelete";
import ModalPilihanProduk from "../../../../components/modals/ModalPilihanProduk";

type Props = {
  isLoadingTransaction: boolean;
  isExistingDataTransaction: boolean;
  dataTransaction?: ResponseStructure<ResponseTransactionType | null>;
  isPageBookingKasir: boolean;
  dataKebutuhanBarang?: ResponseStructure<
    ResponseStatistikKebutuhanBarang[] | null
  >;
  isLoadingKebutuhanBarang?: boolean;

  handleSetToast: (value: string) => void;
  handleSetAlert: (value: string) => void;
  role?: RoleInternalType;
};
const DaftarDetailProduk: FC<Props> = ({
  dataTransaction,
  isExistingDataTransaction,
  isLoadingTransaction,
  dataKebutuhanBarang,
  isPageBookingKasir,
  isLoadingKebutuhanBarang,
  handleSetAlert,
  handleSetToast,
  role,
}) => {
  const {
    isPendingUpdate,
    diskonController,
    hargaJualController,
    quantityController,
    onSubmit,
    isFromActive,
    handleSetIsFromActive,
    handleSubmit,
    siapKirim,
    isExistDataKebutuhanBarang,
    handleToRetur,
    handleDaftarReturBarang,

    isUbahData,
    setIsUbahData,

    handleUbahProduk,

    isPendingTransactionOld,

    isExpired3Days,

    dataModalUpdateProduk,
    handleCloseModalUpdateProduk,
    handleShowModalUpdateProduk,
    idModalUpdateProduk,
    modalUpdateProdukRef,

    handleCloseModalDelete,
    modalDeleteRef,
    handleShowModalDelete,
    isPendingDeleteProduk,
    handleDeleteProduk,
    dataModalDelete,

    dataModalPilihanProduk,
    handleCloseModalPilihanProduk,
    handleShowModalPilihanProduk,
    modalPilihanProdukRef,
  } = useDaftarDetailProduk({
    transactionId: dataTransaction?.data?.id,
    dataKebutuhanBarang,
    isLoadingKebutuhanBarang,
    completedAt: dataTransaction?.data?.completedAt,
  });

  const statusIsBooking =
    dataTransaction?.data?.status === TRANSACTION_STATUS_TYPE.BOOKING;

  return (
    <div className="w-full flex-5 flex flex-col justify-start items-start gap-2.5">
      {/* for SM */}
      <div
        className={cn(
          "w-full flex flex-row overflow-x-auto snap-x snap-mandatory scroll-smooth gap-2.5 pb-2.5 justify-start items-start md:hidden",
        )}
      >
        {isLoadingTransaction ? (
          <LoadingFetch />
        ) : isExistingDataTransaction ? (
          dataTransaction?.data?.details?.map((item, index) => (
            <CardProdukTransaksi
              key={item.id}
              data={item}
              updateBooking={{
                isFromActive,
                isPageBookingKasir,
                isUbahData,
                handleSetIsFromActive,
                handleSubmit,
                onSubmit,
                isPendingUpdate,
                formDiskon: {
                  diskonController,
                  placeholder: "Diskon produk",
                },
                formHargaJual: {
                  hargaJualController,
                  placeholder: "Harga jual produk",
                },
                formQuantity: {
                  quantityController,
                  placeholder: "Jumlah produk",
                },
                disabledDelete:
                  index + 1 === (dataTransaction?.data?.details.length ?? 0),

                ...(isUbahData && {
                  handleDelete: () =>
                    handleShowModalDelete(item.id, {
                      namaProduk: item.produk.nama,
                    }),

                  handleGantiProduk: () =>
                    handleShowModalPilihanProduk(undefined, {
                      detailId: item.id,
                    }),
                }),
              }}
            />
          ))
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <DataEmpty
              title="Data Detail Transaksi Tidak Tersedia"
              description="Belum ada data detail transaksi yang dapat ditampilkan saat ini."
            />
          </div>
        )}
      </div>
      {!isLoadingTransaction &&
        (dataTransaction?.data?.details?.length ?? 0) > 1 && (
          <div className="md:hidden flex mb-4 flex-row justify-center items-center w-full gap-1.5">
            <ChevronsLeftIcon className="size-5 text-base-content stroke-1" />
            <span className="text-xs text-base-content">
              Silahkan Geser ke kanan atau ke kiri
            </span>
            <ChevronsRightIcon className="size-5 text-base-content stroke-1" />
          </div>
        )}
      {/* data for MD & LG  */}
      <div
        className={cn(
          "w-full md:flex flex-col justify-start items-start rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm hidden",
        )}
      >
        {/* data */}
        <div className="w-full flex flex-col justify-start items-start">
          <div className="overflow-x-hidden w-full">
            <table className="table table-xs">
              {/* head */}
              <thead>
                <tr className="text-[0.625rem] bg-base-content/5 h-10">
                  <th>No</th>
                  <th>Gambar</th>
                  <th>Nama Produk</th>
                  <th>Harga (Rp)</th>
                  <th>Diskon (Rp)</th>
                  <th>Qty. Pesan</th>
                  {!statusIsBooking && (
                    <>
                      <th>Qty. Retur</th>
                    </>
                  )}
                  {statusIsBooking && (
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
                  {isPageBookingKasir && (
                    <th>
                      <div className="flex justify-center items-center">
                        <span>Aksi</span>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {isLoadingTransaction ? (
                  Array.from({ length: 4 }, (_, i) => i).map((item) => (
                    <tr key={item} className="h-18">
                      <td colSpan={10}>
                        <div className="w-full skeleton h-12" />
                      </td>
                    </tr>
                  ))
                ) : isExistingDataTransaction ? (
                  <>
                    {dataTransaction?.data?.details.map((item, index) => {
                      const kebutuhanBarang = dataKebutuhanBarang?.data?.find(
                        (kebutuhan) => kebutuhan.produk.id === item.produk.id,
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
                            <p className="xl:text-[0.7rem] text-base-content font-semibold">
                              {item.produk.nama}
                            </p>
                          </td>
                          <td>
                            <span className="xl:text-[0.7rem] text-base-content">
                              {/* harga jual */}
                              {formatRupiah(item.hargaJual)}
                            </span>
                          </td>

                          <td>
                            <span className="xl:text-[0.7rem] text-base-content">
                              {formatRupiah(item.diskon)}
                            </span>
                          </td>
                          <td>
                            {/* qty */}
                            {formatNumber(item.quantity)} Pcs
                          </td>
                          {!statusIsBooking && (
                            <td>
                              <span className="xl:text-[0.7rem] text-base-content">
                                {/* qty */}
                                {formatNumber(item.totalRetur)} Pcs
                              </span>
                            </td>
                          )}
                          {dataTransaction?.data?.status ===
                            TRANSACTION_STATUS_TYPE.BOOKING && (
                            <>
                              <td>
                                {isLoadingKebutuhanBarang ? (
                                  <span className="loading loading-xs" />
                                ) : (
                                  <span className="xl:text-[0.7rem] text-base-content">
                                    {/* stok tersedia */}
                                    {formatNumber(
                                      kebutuhanBarang?.produk.stokTersedia ?? 0,
                                    )}{" "}
                                    Pcs
                                  </span>
                                )}
                              </td>

                              {/* status */}
                              <td>
                                {isLoadingKebutuhanBarang ? (
                                  <span className="loading loading-xs" />
                                ) : kebutuhanBarang?.siapKirim ? (
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

                          {isPageBookingKasir && (
                            <td>
                              <div className="flex flex-row justify-center items-center gap-1">
                                <ButtonUpdateTable
                                  customDataTip="ubah"
                                  handleClick={() =>
                                    handleShowModalUpdateProduk(item.id, {
                                      data: {
                                        hargaJual: item.hargaJual,
                                        hargaModalRataRata:
                                          item.produk.hargaModalRataRata,
                                        hargaPpn: item.produk.hargaPpn,
                                        img: item.produk.img,
                                        nama: item.produk.nama,
                                        produkId: item.produk.id,
                                        quantity: item.quantity,
                                        stok:
                                          kebutuhanBarang?.produk
                                            .stokTersedia ?? 0,
                                        detailId: item.id,
                                        diskon: item.diskon,
                                        hargaJualOld: item.hargaJualOld,
                                        hargaJualTerakhirTransaksi:
                                          item.hargaJualTerakhir ?? undefined,
                                        transactionId:
                                          dataTransaction?.data?.id,
                                      },
                                    })
                                  }
                                />

                                <ButtonDeleteTable
                                  disabled={
                                    dataTransaction?.data?.details.length === 1
                                  }
                                  customDataTip="hapus"
                                  handleShowModalDelete={() =>
                                    handleShowModalDelete(item.id, {
                                      namaProduk: item.produk.nama,
                                    })
                                  }
                                  isLoading={isPendingDeleteProduk}
                                />
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}

                    <tr>
                      <td colSpan={10}>
                        <div
                          className={cn(
                            "h-10 flex flex-row justify-between items-center",
                            !statusIsBooking &&
                              "border-b border-base-content/30",
                          )}
                        >
                          <span className="text-xs font-medium text-base-content/80">
                            Total {dataTransaction?.data?.details.length} Item
                          </span>

                          {statusIsBooking && (
                            <div className="flex flex-row justify-center items-center">
                              <div className="flex flex-row justify-start items-center gap-2.5">
                                <span className="text-[0.7rem] font-medium text-base-content">
                                  Total Barang Dibutuhkan :
                                </span>
                                <span className="text-[0.7rem] font-medium text-base-content">
                                  {formatNumber(
                                    dataKebutuhanBarang?.data?.reduce(
                                      (total, item) =>
                                        total + item.produk.stokBooking,
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
                                (dataTransaction?.data?.totalBayar ?? 0) -
                                  (dataTransaction?.data?.ongkir ?? 0),
                              )}
                            </span>
                          </div>
                        </div>

                        {/* total nilai retur */}
                        {!statusIsBooking && (
                          <div className="h-10 flex flex-row justify-between items-center">
                            <span className="text-xs font-medium text-base-content/80">
                              Total Nilai Retur
                            </span>

                            <div className="flex justify-end items-end">
                              <span className="text-xs font-semibold text-base-content">
                                {formatRupiah(
                                  dataTransaction?.data?.details.reduce(
                                    (acc, curr) =>
                                      acc +
                                      (curr.totalRetur ?? 0) * curr.hargaJual,
                                    0,
                                  ) ?? 0,
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={10}>
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
      {isPageBookingKasir &&
        dataTransaction?.data?.metodePembayaran !== PAYMENT_METHOD_TYPE.TEMPO &&
        statusIsBooking && (
          <div className="w-full flex flex-col md:flex-row justify-end items-end gap-2.5 md:gap-0">
            <ButtonWithIcon
              icon={PackagePlus}
              bgColor="bg-success"
              textColor="text-primary-white"
              customWidth="hidden md:flex w-full"
              label="Tambah Produk"
              handleBtn={() =>
                handleShowModalUpdateProduk(undefined, {
                  transactionId: dataTransaction?.data?.id,
                })
              }
              skeleton={isLoadingTransaction}
            />

            <ButtonWithIcon
              icon={PackagePlus}
              bgColor="bg-success"
              textColor="text-primary-white"
              customWidth="flex md:hidden w-full"
              label="Tambah Produk"
              handleBtn={() =>
                handleShowModalPilihanProduk(undefined, {
                  transactionId: dataTransaction?.data?.id,
                })
              }
              skeleton={isLoadingTransaction}
            />

            {isUbahData ? (
              <ButtonWithIcon
                icon={X}
                bgColor="bg-error"
                textColor="text-primary-white"
                customWidth="w-full"
                label="Tutup"
                handleBtn={() => setIsUbahData(false)}
                skeleton={isLoadingTransaction}
              />
            ) : (
              <ButtonWithIcon
                icon={Pencil}
                bgColor="bg-info"
                textColor="text-primary-white"
                customWidth="w-full"
                classHidden="md:hidden flex"
                label="Ubah Harga / Diskon / Quantity"
                handleBtn={() => setIsUbahData(true)}
                skeleton={isLoadingTransaction}
              />
            )}
          </div>
        )}
      {dataTransaction?.data?.status === TRANSACTION_STATUS_TYPE.COMPLETED &&
        (!isExpired3Days ? (
          <AlertLabel
            isLoading={isLoadingTransaction}
            message="Transaksi hanya dapat dibatalkan dalam waktu maksimal 3 hari setelah transaksi selesai."
          />
        ) : (
          <AlertLabel
            isLoading={isLoadingTransaction}
            message="Transaksi tidak dapat dibatalkan karena telah melewati batas waktu 3 hari."
          />
        ))}
      {/* alert label */}
      {dataTransaction?.data?.metodePembayaran !== PAYMENT_METHOD_TYPE.TEMPO ? (
        <>
          <AlertLabel
            isLoading={isLoadingTransaction}
            message="Quantity retur merupakan total barang yang telah memperoleh persetujuan owner dan berhasil diproses sebagai retur."
          />

          <AlertLabel
            isLoading={isLoadingTransaction}
            message="Transaksi hanya dapat diperbarui dalam waktu 3 hari sejak transaksi selesai."
          />
        </>
      ) : (
        <AlertLabel
          isLoading={isLoadingTransaction}
          message="Mohon maaf, fitur ubah transaksi dan retur belum tersedia untuk metode pembayaran tempo. Silahkan tunggu untuk update selanjutnya."
        />
      )}
      {!isLoadingTransaction && (
        <div
          className={cn(
            "w-full flex flex-col md:flex-row items-end gap-2.5",
            role === ROLE_INTERNAL_TYPE.KASIR && !isExpired3Days
              ? "justify-between"
              : "justify-end",
          )}
        >
          {/* ubah transaksi */}
          {role === ROLE_INTERNAL_TYPE.KASIR &&
            !isPageBookingKasir &&
            dataTransaction?.data?.metodePembayaran !==
              PAYMENT_METHOD_TYPE.TEMPO &&
            dataTransaction?.data?.completedAt &&
            dataTransaction?.data?.status ===
              TRANSACTION_STATUS_TYPE.COMPLETED &&
            !isExpired3Days && (
              <ButtonWithIcon
                label="Ubah Transaksi"
                icon={PencilLine}
                bgColor="bg-info"
                textColor="text-primary-white"
                customWidth="w-full md:w-auto"
                isLoading={isPendingTransactionOld}
                handleBtn={() =>
                  handleUbahProduk({ id: dataTransaction?.data?.id })
                }
              />
            )}

          {!statusIsBooking &&
            dataTransaction?.data?.metodePembayaran !==
              PAYMENT_METHOD_TYPE.TEMPO && (
              <div className="w-full md:w-auto flex flex-row justify-start items-center gap-2.5">
                <ButtonWithIcon
                  label="Lihat Daftar Retur Barang"
                  icon={Eye}
                  handleBtn={() =>
                    handleDaftarReturBarang(dataTransaction?.data?.id)
                  }
                  customWidth="flex-1md:flex-none"
                />

                {dataTransaction?.data?.status ===
                  TRANSACTION_STATUS_TYPE.COMPLETED && (
                  <ButtonWithIcon
                    label="Retur Barang"
                    icon={Undo}
                    bgColor="bg-error"
                    textColor="text-primary-white"
                    handleBtn={() => handleToRetur()}
                    customWidth="flex-1 md:flex-none"
                  />
                )}
              </div>
            )}
        </div>
      )}
      {isExistDataKebutuhanBarang &&
        !isLoadingKebutuhanBarang &&
        !siapKirim && (
          <AlertLabel
            isLoading={isLoadingTransaction}
            warning
            message="Masih terdapat barang yang kekurangan stok. Lengkapi stok terlebih dahulu sebelum menyelesaikan booking."
          />
        )}
      {/* transaksi booking */}
      {statusIsBooking && (
        <AlertLabelList
          isLoading={isLoadingTransaction}
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
        handleSetToast={handleSetToast}
        handleSetAlert={handleSetAlert}
      />
      <ModalFormulirTransaksi
        modalRef={modalUpdateProdukRef}
        data={dataModalUpdateProduk?.data}
        transactionIdForAddProdukForUpdateTransaksi={
          dataModalUpdateProduk?.transactionId
        }
        index={idModalUpdateProduk}
        handleCloseModal={handleCloseModalUpdateProduk}
        handleSetAlert={handleSetAlert}
        existProduks={dataTransaction?.data?.details.map((item) => ({
          produkId: item.produk.id,
        }))}
        pelangganId={dataTransaction?.data?.pelanggan?.id}
        isBooking
      />
      {/* modal pilihan produk */}
      <ModalPilihanProduk
        modalRef={modalPilihanProdukRef}
        handleCloseModal={handleCloseModalPilihanProduk}
        detailId={dataModalPilihanProduk?.detailId}
        transactionId={dataTransaction?.data?.id}
        enabled={statusIsBooking}
        existProduks={dataTransaction?.data?.details.map((item) => ({
          produkId: item.produk.id,
        }))}
        transactionIdForAddProdukForUpdateTransaksi={
          dataModalPilihanProduk?.transactionId
        }
        pelangganId={dataTransaction?.data?.pelanggan?.id}
      />
      {/* modal delete */}
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDeleteProduk}
        isLoadingDelete={isPendingDeleteProduk}
        bigTitle="Apakah anda yakin ingin menghapus produk ini dari transaksi booking?"
        highlightData={dataModalDelete?.namaProduk}
      />
    </div>
  );
};

export default DaftarDetailProduk;
