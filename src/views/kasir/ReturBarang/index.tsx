import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronsRightIcon,
  IdCard,
  PackageMinus,
  Phone,
  ReceiptText,
  Undo2,
  UserRound,
  X,
} from "lucide-react";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import CardStatistikLarge from "../../../components/ui/cards/CardStatistikLarge";
import useReturBarang from "./useReturBarang";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
} from "../../../helpers/helpers";
import { cn } from "../../../utils/cn";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import ModalAlert from "../../../components/modals/ModalAlert";
import DataEmpty from "../../../components/messages/DataEmpty";
import AlertLabel from "../../../components/messages/AlertLabel";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import CardProdukTransaksi from "../../../components/ui/cards/CardProdukTransaksi";
import LoadingFetch from "../../../components/ui/LoadingFetch";
import FormData from "./FormData/FormData";
import ModalFormulirVerifikasiOrPengajuanReturBarang from "../../../components/modals/ModalFormulirVerifikasiOrPengajuanReturBarang";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_RETUR_BARANG } from "../../../types/toast.type";

const ReturBarang = () => {
  const {
    handleBack,
    dataForReturBarang,
    isLoadingForReturBarang,
    handleAppend,
    summary,
    dataConfirm,
    handleCancelConfirm,
    handleConfirm,
    modalConfirmRef,
    handleBatalRetur,
    isCanSimpanAndAjukan,
    pengguna,
    windowSize,
    handleRemove,
    isLoadingReturDraftDetail,
    isPendingAddReturnDetail,
    isPendingDeleteReturnDetail,
    returnDetailMap,
    returnDetails,
    transactionDetailMap,
    combinedReturnDetails,
    handleCloseModalPengajuanOrVerifikasi,
    handleShowModalPengajuanOrVerifikasi,
    modalPengajuanOrVerifikasiRef,

    dataReturDraftDetail,

    isLoadingReturDetails,
    validateReturBarangId,

    handleSetToast,
    toast,
  } = useReturBarang();

  return (
    <div className="w-full">
      {/* toast */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_RETUR_BARANG[toast.type].message}
          color={TOAST_CONFIG_RETUR_BARANG[toast.type].color}
        />
      )}
      <div
        className={cn(
          "flex w-full flex-col justify-start items-start gap-2.5 px-2.5 pt-2.5",
        )}
      >
        <ButtonBackText handleClick={() => handleBack()} />

        <div className="w-full bg-base-100 rounded-2xl md:rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2.5 gap-2.5 flex-wrap border border-transparent dark:border-base-content/10 shadow-sm">
          {/* nomor transaksi */}
          <CardStatistikLarge
            icon={{
              largeIcon: ReceiptText,
              bgColor: "bg-emerald-50 dark:bg-emerald-100",
              textColor: "text-emerald-600",
              smallIcon: Calendar,
            }}
            label="Nomor Transaksi"
            largeValue={{
              value: dataForReturBarang?.data?.nomorTransaksi,
              textColor: "text-info",
            }}
            smallValue={formatTanggalLengkap(
              dataForReturBarang?.data?.completedAt ?? new Date(),
            )}
            customWidth="col-span-1"
            statusTransaction={dataForReturBarang?.data?.status}
            isLoading={isLoadingForReturBarang}
          />

          {/* data kasir */}
          <CardStatistikLarge
            icon={{
              largeIcon: UserRound,
              bgColor: "bg-purple-50 dark:bg-purple-100",
              textColor: "text-purple-600",
              smallIcon: IdCard,
            }}
            label="Kasir"
            largeValue={{
              value: dataForReturBarang?.data?.kasir?.nama,
            }}
            smallValue={dataForReturBarang?.data?.kasir?.username}
            customWidth="col-span-1"
            isActive={dataForReturBarang?.data?.kasir?.isActive}
            isLoading={isLoadingForReturBarang}
          />

          {/* data pelanggan */}
          <CardStatistikLarge
            icon={{
              largeIcon: UserRound,
              bgColor: "bg-blue-50 dark:bg-blue-100",
              textColor: "text-blue-600",
              smallIcon: Phone,
            }}
            label="Pelanggan"
            largeValue={{
              value: dataForReturBarang?.data?.pelanggan?.nama,
            }}
            smallValue={formatNumberPhone(
              dataForReturBarang?.data?.pelanggan?.noWa ?? "",
            )}
            customWidth="col-span-1"
            isActive={dataForReturBarang?.data?.pelanggan?.isActive}
            isLoading={isLoadingForReturBarang}
          />
        </div>

        {/* data for mobile */}
        <div
          className={cn(
            "w-full flex flex-col justify-start items-start rounded-xl border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm overflow-hidden",
          )}
        >
          <div className="w-full flex flex-col justify-start items-start gap-0.5 pt-2.5 px-2.5">
            <h2 className="text-sm font-semibold text-base-content">
              Data produk yang sudah dipesan saat transaksi
            </h2>
            <span className="text-base-content text-xs">
              Berisi daftar produk yang sebelumnya dipesan dalam transaksi.
            </span>
          </div>

          {/* DATA FOR SM */}
          <div className="w-full flex flex-row justify-start items-start gap-2.5 md:hidden mt-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth p-2.5">
            {isLoadingForReturBarang ? (
              <LoadingFetch />
            ) : dataForReturBarang?.data &&
              dataForReturBarang?.data?.details.length > 0 ? (
              dataForReturBarang?.data?.details?.map((item) => (
                <CardProdukTransaksi
                  key={item.id}
                  data={item}
                  handleAppend={handleAppend}
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

          {!isLoadingForReturBarang && (
            <div className="md:hidden flex my-4 flex-row justify-center items-center w-full gap-1.5">
              <span className="text-xs text-base-content">
                Silahkan Geser ke kanan
              </span>
              <ChevronsRightIcon className="size-5 text-base-content stroke-1" />
            </div>
          )}

          {/* DATA FOR MD & LG */}
          <div
            className={cn(
              "w-full md:flex flex-col justify-start items-start rounded-xl border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm overflow-hidden hidden p-2.5",
            )}
          >
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
                      <th>Qty. Pesan</th>
                      <th>Qty. Retur</th>
                      <th>Subtotal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    {isLoadingForReturBarang ? (
                      Array.from({ length: 4 }, (_, i) => i).map((item) => (
                        <tr key={item} className="h-18">
                          <td colSpan={9}>
                            <div className="w-full skeleton h-12" />
                          </td>
                        </tr>
                      ))
                    ) : dataForReturBarang?.data &&
                      dataForReturBarang?.data?.details.length > 0 ? (
                      <>
                        {dataForReturBarang?.data?.details.map(
                          (item, index) => {
                            return (
                              <tr
                                key={item.id}
                                className="h-18 text-base-content"
                              >
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
                                    <p className="xl:text-[0.7rem] text-base-content font-semibold">
                                      {item.produk.nama}
                                    </p>
                                    <span className="xl:text-[0.7rem] font-medium text-base-content/70">
                                      {item.produk.kode}
                                    </span>
                                  </div>
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
                                  <span className="xl:text-[0.7rem] text-base-content">
                                    {/* qty */}
                                    {formatNumber(item.quantity)} Pcs
                                  </span>
                                </td>
                                <td>
                                  <span className="xl:text-[0.7rem] text-base-content">
                                    {/* qty */}
                                    {formatNumber(item.totalRetur)} Pcs
                                  </span>
                                </td>
                                <td>
                                  <span className="font-medium h-full flex flex-row justify-start items-start xl:text-[0.7rem] text-base-content">
                                    {formatRupiah(
                                      item.hargaJual * item.quantity -
                                        item.diskon,
                                    )}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    disabled={
                                      item.quantity <= item.totalRetur ||
                                      returnDetails?.some((item) => item.id)
                                    }
                                    type="button"
                                    className="text-[0.625rem] font-medium px-2 py-1 border border-rose-600 rounded-md flex flex-row justify-start items-center gap-1 not-disabled:hover:text-primary-white not-disabled:transition-all not-disabled:duration-150 not-disabled:ease-in-out not-disabled:hover:bg-rose-600"
                                    onClick={() =>
                                      handleAppend({
                                        detailId: item.id,
                                        hargaJual: item.hargaJual,
                                        maxQuantity:
                                          item.quantity - item.totalRetur,
                                        quantityWasRetur: item.totalRetur,
                                      })
                                    }
                                  >
                                    <Undo2 className="size-3" />

                                    <span>Retur</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          },
                        )}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={9}>
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
        </div>

        {/* alert label */}
        <AlertLabel
          isLoading={isLoadingForReturBarang}
          message="Quantity retur merupakan total barang yang telah memperoleh persetujuan owner dan berhasil diproses sebagai retur."
        />
        {/* form retur */}
        <div
          className="w-full flex flex-col justify-start items-start gap-2.5"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <div
            className={cn(
              "w-full flex flex-col justify-start items-start rounded-xl border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm p-2.5",
            )}
          >
            {/* title */}
            <div className="w-full flex flex-col justify-start items-start gap-0.5">
              <h2 className="text-sm font-semibold text-base-content">
                Formulir retur barang
              </h2>
              <span className="text-base-content text-xs">
                Isi data retur barang yang sudah dipilih
              </span>
            </div>

            {/* card formulir */}
            <div className="w-full flex flex-col justify-start items-start gap-2.5 mt-2.5">
              {isLoadingReturDraftDetail || isLoadingReturDetails ? (
                <>
                  <div className="w-full h-12 skeleton border border-base-content/10 rounded-2xl md:rounded-xl" />
                </>
              ) : combinedReturnDetails.length > 0 ? (
                combinedReturnDetails.map((item, _) => (
                  <div
                    key={item.id}
                    className="w-full p-2.5 flex flex-col justify-start md:grid md:grid-cols-11 lg:grid-cols-4 md:gap-2.5 items-stretch border border-base-content/10 rounded-xl"
                  >
                    {/* info */}
                    <div className="md:col-span-3 lg:col-span-1 flex flex-row justify-start items-start gap-4">
                      {/* img */}
                      <div className="w-12 h-12 md:w-13 md:h-13 shrink-0 lg:w-16 lg:h-16 rounded-xl overflow-hidden">
                        <img
                          src={item.produk?.img}
                          alt="foto produk"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* detail */}
                      <div className="flex flex-row md:flex-col justify-start items-start gap-2.5 md:gap-0.5">
                        <div className="flex flex-col justify-start items-start gap-0.5 border-r border-base-content/30 pr-2.5 md:border-none">
                          {/* nama */}
                          <span className="text-xs font-semibold text-base-content">
                            {item?.produk?.nama}
                          </span>
                          <span className="text-[0.625rem] font-medium text-base-content/70">
                            {item?.produk?.kode ?? "-"}
                          </span>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-0.5">
                          {/* nama */}
                          <span className="text-[0.625rem] font-semibold text-base-content/70">
                            Harga Jual
                          </span>
                          <span className="text-[0.625rem] font-semibold text-base-content">
                            {formatRupiah(item?.hargaJual)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <FormData
                      hargaBeliRetur={item.hargaBeliRetur ?? item.hargaJual}
                      maxQuantity={
                        item.quantityTransaction === 1
                          ? 1
                          : item.quantityTransaction - item.totalRetur
                      }
                      quantityReturn={item.quantityReturn}
                      returnDetailId={item.id}
                      returnTransactionId={item.returnTransactionId ?? 0}
                      totalRefund={item.totalRefund}
                      transactionId={dataForReturBarang?.data?.id ?? 0}
                      handleSetToast={handleSetToast}
                    />
                  </div>
                ))
              ) : (
                <div className="w-full flex flex-row justify-center items-center">
                  <DataEmpty
                    xs
                    title="Data Barang Retur Tidak Tersedia"
                    description="Silakan pilih barang yang akan diretur, lalu tentukan jumlah barang yang ingin dikembalikan."
                  />
                </div>
              )}
            </div>
          </div>

          {/* preview */}
          <div
            className={cn(
              "w-full flex flex-col justify-start items-start rounded-xl border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm p-2.5",
            )}
          >
            <div className="w-full flex flex-col justify-start items-start gap-0.5">
              <h2 className="text-sm font-semibold text-base-content">
                Ringkasan Retur
              </h2>
              <span className="text-base-content text-xs">
                Berisi informasi ringkasan retur
              </span>
            </div>

            <div className="w-full gap-2.5 grid grid-cols-1 md:grid-cols-3 mt-4">
              <CardStatistikLarge
                icon={{
                  largeIcon: PackageMinus,
                  bgColor: "bg-rose-50 dark:bg-rose-100",
                  textColor: "text-rose-600",
                }}
                label="Total Item Retur Barang"
                largeValue={{
                  value: `${formatNumber(summary.totalQuantity)}`,
                }}
                smallValue={"Total barang yang diretur"}
                customWidth="col-span-1"
                isLoading={isLoadingReturDraftDetail}
              />

              <CardStatistikLarge
                icon={{
                  largeIcon: Undo2,
                  bgColor: "bg-blue-50 dark:bg-blue-100",
                  textColor: "text-blue-600",
                }}
                label="Total Refund"
                largeValue={{
                  value: `${formatRupiah(summary.totalRefund)}`,
                }}
                smallValue={"Total uang refund / uang kembali"}
                customWidth="col-span-1"
                isLoading={isLoadingReturDraftDetail}
              />
            </div>

            <div className="w-full md:gap-2.5 grid grid-cols-4 md:grid-cols-3 mt-4">
              {/* <div className="col-span-4 md:col-span-1">
                <InputTextAreaNonIcon
                  register={register("keterangan")}
                  name="keterangan"
                  label="Keterangan (Opsional)"
                  placeholder="Contoh: Mengajukan retur"
                  rows={3}
                  errorMessage={errors?.keterangan?.message}
                />
              </div>

              <div className="col-span-4 md:col-span-1">
                <InputPrice<CreateReturnRequestType>
                  controller={customTotalRefundController}
                  label="Custom Total Refund"
                  name="customTotalRefund"
                  placeholder="Contoh: 10.000"
                  caption="Silahkan isi jika ingin mengubah total refund"
                  disabled={!isCanSimpanAndAjukan}
                />
              </div> */}

              {/* aksi */}
              <div className="col-span-4 md:col-span-1 flex-row justify-start items-center gap-2.5 pb-2 grid grid-cols-2">
                {/* simpan dan ajukan */}
                <ButtonWithIcon
                  disabled={!isCanSimpanAndAjukan}
                  icon={Check}
                  // tambahkan response created by agar saya mudah melacak nya
                  label={
                    pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
                      ? "Simpan dan Review"
                      : "Simpan dan Ajukan"
                  }
                  handleBtn={() => handleShowModalPengajuanOrVerifikasi()}
                  customWidth="col-span-1"
                  skeleton={isLoadingForReturBarang}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <ModalAlert
        icon={AlertTriangle}
        iconColor="text-warning"
        modalRef={modalConfirmRef}
        bigTitle={dataConfirm?.bigTitle ?? ""}
        smallTitle={dataConfirm?.smallTitle ?? ""}
        handleCloseModal={handleCancelConfirm}
        handleConfirm={handleConfirm}
        labelNext="Lanjutkan"
        // isLoading={isPendingMutateReturBarang}
      />

      {/* modal pengajuan  */}
      <ModalFormulirVerifikasiOrPengajuanReturBarang
        modalRef={modalPengajuanOrVerifikasiRef}
        handleCloseModal={handleCloseModalPengajuanOrVerifikasi}
        kodeReferensi={dataForReturBarang?.data?.nomorTransaksi ?? ""}
        returId={dataReturDraftDetail?.data?.id ?? validateReturBarangId ?? 0}
        role={pengguna?.role}
        transactionId={dataForReturBarang?.data?.id}
      />
    </div>
  );
};

export default ReturBarang;
