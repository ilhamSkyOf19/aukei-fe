import { type FC } from "react";
import ShowProduk from "./ShowProduk";
import {
  Minus,
  PackagePlus,
  Pencil,
  Phone,
  Receipt,
  Save,
  ShoppingCart,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import { formatNumberPhone, formatRupiah } from "../../../../helpers/helpers";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import usePilihProduk from "./usePilihProduk";
import ModalChoosePelanggan from "../../../../components/modals/ModalChoosePelanggan";
import Alert from "../../../../components/messages/Alert";
import { ALERT_CONFIG_TRANSACTION } from "../../../../types/alert.types";
import { cn } from "../../../../utils/cn";
import Avatar from "../../../../components/ui/Avatar";
import ModalFormulirTransaksi from "../../../../components/modals/ModalFormulirTransaksi";
import DataEmpty from "../../../../components/messages/DataEmpty";

type Props = {
  step: number;
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
};
const PilihProduk: FC<Props> = ({ handleSteps, step, handleToast }) => {
  // call use
  const {
    handleAddDetails,
    handleRemoveAllDetails,
    handleSetPelanggan,
    handleStepsNext,
    isErrorsFormState,
    pelanggan,
    produkDetails,
    removeDetails,
    handleCloseModalChoosePelanggan,
    handleShowModalChoosePelanggan,
    modalChoosePelangganRef,
    alert,
    isUpdateTransaction,
    handleSimpanKeranjang,
    isPendingKeranjang,
    isUpdateKeranjang,
    handleBatalkanSimpanKeranjang,
    handleBatalkanUpdateTransaction,
    handleSimpanPerubahanKeranjang,
    handleAppendMany,
    handleCloseModalFormulirTransaksi,
    handleShowModalFormulirTransaksi,
    modalFormulirTransaksiRef,
    idModalUpdateTransaksi,
    dataModalFormulirTransaksi,
    handleShowModalFormulirTransaksiForUpdate,
    isModeKasir,
  } = usePilihProduk({
    handleSteps,
    handleToast,
  });

  return (
    <div className="w-full flex flex-row justify-between items-start gap-3">
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_TRANSACTION[alert.type].message}
          full
        />
      )}

      {/* content left */}
      <div className="w-full lg:flex-3 xl:flex-1 flex flex-col justify-start items-start gap-2.5">
        {/* pelanggan */}
        {!isUpdateKeranjang && (
          <div
            className={cn(
              "w-full flex flex-row justify-between items-center shadow-sm border rounded-lg py-2.5 px-3 bg-base-100",
              isErrorsFormState.includes("pelanggan")
                ? "border-error"
                : "border-transparent dark:border-base-content/10",
            )}
          >
            {/* avatar, name, no telp */}
            <div className="flex-1 flex flex-row justify-start items-center gap-3 lg:h-8 xl:h-10">
              {!pelanggan ? (
                <span className="xl:text-xs text-base-content font-medium">
                  Silahkan pilih pelanggan
                </span>
              ) : (
                <>
                  {/* avatar */}
                  <Avatar nama={pelanggan?.nama} />
                  <div className="flex flex-col justify-start items-start gap-1">
                    {/* name */}
                    <span className="text-base-content font-semibold text-sm">
                      {pelanggan?.nama}
                    </span>
                    {/* no telp */}
                    <div className="w-full flex flex-row justify-start items-center gap-2">
                      <Phone className="size-3 text-base-content/80" />
                      <span className="text-base-content/80 font-semibold text-xs">
                        {formatNumberPhone(pelanggan?.noWa)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* button */}
            <div className="flex-1 flex flex-row justify-end items-center">
              <ButtonWithIcon
                icon={UsersRound}
                label="Pilih Pelanggan"
                handleBtn={() => handleShowModalChoosePelanggan()}
              />
            </div>
          </div>
        )}

        {/* preview produk */}
        <div
          className={cn(
            "w-full flex flex-col justify-start items-start rounded-lg bg-base-100 shadow-sm border",
            isErrorsFormState.includes("details")
              ? "border-error"
              : "border-base-content/10",
          )}
        >
          {/* header */}
          <div className="w-full flex flex-row justify-between items-center px-4 pt-3 pb-2">
            <h3 className="xl:text-xs font-medium text-base-content">
              {isUpdateKeranjang ? "Ubah Keranjang" : "Data Transaksi"}
            </h3>

            {produkDetails.length > 0 && (
              <button
                type="button"
                className="py-1.5 px-2 flex flex-row justify-start items-center gap-2 border border-transparent hover:border-error rounded-md transition-all duration-150 ease-in-out"
                onClick={handleRemoveAllDetails}
              >
                <Trash2 className="lg:size-3.5 xl:size-4 text-error" />
                <span className="lg:text-[0.625rem] xl:text-[0.7rem] font-medium text-error">
                  Kosongkan Semua
                </span>
              </button>
            )}
          </div>

          {/* data */}
          <div className="w-full flex flex-col justify-start items-start pb-6">
            <div
              className={cn(
                "overflow-y-auto w-full scrollbar-thumb-custom-secondary transition-all duration-500 ease-in-out",
                isModeKasir
                  ? isUpdateKeranjang
                    ? "xl:h-85"
                    : "xl:h-67"
                  : "xl:h-53",
              )}
            >
              <table className="table table-xs table-zebra table-pin-rows table-pin-cols">
                {/* head */}
                <thead>
                  <tr className="text-[0.625rem] bg-base-content/5 h-8">
                    <th>Gambar</th>
                    <th>Nama Produk</th>
                    <th>Harga Terakhir</th>
                    <th>Harga (Rp)</th>
                    <th>Diskon (Rp)</th>
                    <th>Jumlah</th>
                    <th>Subtotal</th>
                    <th>aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {produkDetails.length > 0 ? (
                    produkDetails.map((item) => (
                      <tr key={item.id} className="h-12">
                        <td>
                          <div className="avatar">
                            <div className="mask mask-squircle lg:h-9 lg:w-9 xl:h-10 xl:w-10">
                              <img src={item.img} alt="gambar produk" />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col justify-start items-start gap-px">
                            <p className="xl:text-[0.7rem] text-base-content">
                              {item.nama}
                            </p>
                            <span className="xl:text-[0.625rem] font-medium text-base-content/50">
                              {item.kode}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="xl:text-[0.7rem] text-base-content">
                            {item.hargaJualTerakhirTransaksi
                              ? formatRupiah(item.hargaJualTerakhirTransaksi)
                              : "-"}
                          </span>
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
                            {item.quantity} x
                          </span>
                        </td>
                        <td>
                          <span className=" xl:text-[0.7rem] text-base-content">
                            {formatRupiah(item.subTotal - item.diskon)}
                          </span>
                        </td>
                        <td>
                          <div className="flex flex-row justify-start items-start gap-1">
                            <button
                              type="button"
                              className="rounded-md transition-opacity duration-200 ease-in-out group xl:w-7 xl:h-7 lg:w-6 lg:h-6 flex flex-row justify-center items-center bg-info"
                              onClick={() =>
                                handleShowModalFormulirTransaksiForUpdate(
                                  item.id,
                                )
                              }
                            >
                              <Pencil className="size-3 text-primary-white" />
                            </button>
                            <button
                              type="button"
                              className="rounded-md transition-opacity duration-200 ease-in-out group xl:w-7 xl:h-7 lg:w-6 lg:h-6 flex flex-row justify-center items-center bg-error"
                              onClick={() => removeDetails(item.id)}
                            >
                              <Trash2 className="size-3 text-primary-white" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <div className="w-full flex flex-col justify-center items-center scale-90 h-50">
                          <DataEmpty
                            iconData={PackagePlus}
                            title="Silahkan Pilih Produk"
                            description="Pilih produk dari daftar untuk menambahkannya ke transaksi"
                            xs
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* total */}
        <div className="w-full flex flex-col justify-start items-start rounded-lg border border-base-content/10 px-3 py-4 bg-base-100 shadow-sm">
          {/* sub total & total diskon */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5 pb-4 border-b border-base-content/10">
            {/* sub total */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="lg:text-[0.625rem] xl:text-xs font-medium text-base-content/60">
                Subtotal
              </span>
              <span className="lg:text-[0.625rem] xl:text-xs font-semibold text-base-content">
                {formatRupiah(
                  produkDetails.reduce((a, b) => a + b.subTotal, 0),
                )}
              </span>
            </div>

            {/* total diskon */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="lg:text-[0.625rem] xl:text-xs font-medium text-base-content/60">
                Total Diskon
              </span>
              <div className="flex flex-row justify-start items-center gap-1">
                {produkDetails.reduce((a, b) => a + b.diskon, 0) > 0 && (
                  <span className="lg:text-[0.625rem] xl:text-xs font-semibold text-error">
                    <Minus className="size-2" />
                  </span>
                )}

                <span className="lg:text-[0.625rem] xl:text-xs font-semibold text-error">
                  {formatRupiah(
                    produkDetails.reduce((a, b) => a + b.diskon, 0),
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* total */}
          <div className="w-full flex flex-row justify-between items-center pt-3 pb-1">
            <span className="xl:text-sm font-semibold text-base-content">
              Total
            </span>
            <span className="xl:text-sm font-medium text-emerald-600">
              {formatRupiah(
                produkDetails.reduce((a, b) => a + (b.subTotal - b.diskon), 0),
              )}
            </span>
          </div>
        </div>

        {/* button chart and transaksi */}
        {isUpdateKeranjang ? (
          <div className="w-full flex flex-row justify-between items-center gap-4 bg-base-100 border border-transparent dark:border-base-content/10 shadow-sm rounded-lg  xl:p-1 h-12">
            {/* button batalkan */}
            <button
              type="button"
              className="flex flex-row justify-center items-center gap-4 h-full flex-1 rounded-lg border border-custom-primary hover-overlay"
              onClick={() => handleBatalkanSimpanKeranjang()}
            >
              <X className="xl:size-5 lg:size-4 text-base-content" />
              <span className="text-base-content lg:text-[0.625rem] xl:text-xs font-semibold">
                Batalkan
              </span>
            </button>

            {/* simpan */}
            <button
              disabled={produkDetails.length === 0}
              type="button"
              className={cn(
                "flex flex-row justify-center items-center gap-4 h-full border border-custom-primary flex-1 rounded-lg bg-custom-primary disabled:opacity-50",
                produkDetails.length !== 0 && "hover-overlay",
              )}
              style={{
                cursor: produkDetails.length === 0 ? "not-allowed" : "pointer",
              }}
              onClick={() => handleSimpanPerubahanKeranjang()}
            >
              {isPendingKeranjang ? (
                <div className="loading lg:loading-xs xl:loading-sm text-custom-secondary" />
              ) : (
                <>
                  {/* icon */}
                  <Save className="xl:size-4 text-custom-secondary" />
                  <span className="text-custom-secondary xl:text-xs font-semibold">
                    Simpan Perubahan
                  </span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div
            className={cn(
              "w-full flex flex-row justify-between items-center bg-base-100 border border-transparent dark:border-base-content/10 shadow-sm rounded-lg xl:p-1 h-12 tooltip",
              isUpdateTransaction ? "gap-2" : "gap-4",
            )}
            data-tip={
              !pelanggan || produkDetails.length === 0
                ? "Silahkan lengkapi data pelanggan dan produk terlebih dahulu"
                : ""
            }
          >
            {/* button chart */}
            <button
              type="button"
              disabled={produkDetails.length === 0 || !pelanggan}
              className={cn(
                "flex-1 flex flex-row justify-center items-center gap-4 xl:h-full rounded-lg border border-custom-primary disabled:opacity-50",
                (produkDetails.length > 0 || !pelanggan) && "hover-overlay",
              )}
              style={{
                cursor:
                  produkDetails.length === 0 || !pelanggan
                    ? "not-allowed"
                    : "pointer",
              }}
              onClick={() => {
                handleSimpanKeranjang();
              }}
            >
              {isPendingKeranjang ? (
                <div className="loading lg:loading-xs xl:loading-sm text-base-content" />
              ) : (
                <>
                  {/* icon */}
                  <ShoppingCart className="xl:size-4 text-base-content" />
                  <span className="text-base-content xl:text-xs font-semibold">
                    Masukan ke Keranjang
                  </span>
                </>
              )}
            </button>

            <div
              className={cn(
                "flex-1 flex flex-row h-full justify-end items-center gap-2",
              )}
            >
              {isUpdateTransaction && (
                <button
                  type="button"
                  className="flex flex-row justify-center items-center gap-4 h-full flex-1 rounded-lg bg-error hover-overlay "
                  onClick={() => {
                    handleBatalkanUpdateTransaction();
                  }}
                >
                  <>
                    {/* icon */}
                    <X className="size-4 text-primary-white" />
                    <span className="text-primary-white text-xs font-semibold">
                      Batalkan
                    </span>
                  </>
                </button>
              )}

              <button
                type="button"
                disabled={produkDetails?.length === 0 || !pelanggan}
                className={cn(
                  "flex flex-row justify-center items-center gap-4 h-full border border-custom-primary flex-1 rounded-lg bg-custom-primary disabled:opacity-50",
                  (produkDetails.length > 0 || !pelanggan) && "hover-overlay",
                )}
                style={{
                  cursor:
                    produkDetails?.length === 0 || !pelanggan
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={handleStepsNext}
              >
                {/* icon */}
                {isUpdateTransaction ? (
                  <Save className="size-4 text-custom-secondary" />
                ) : (
                  <Receipt className="size-4 text-custom-secondary" />
                )}
                <span className="text-custom-secondary xl:text-xs font-semibold">
                  {isUpdateTransaction ? "Simpan" : "Pembayaran"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* content right */}
      <ShowProduk
        handleShowModalFormulirTransaksi={handleShowModalFormulirTransaksi}
        onAppendMany={handleAppendMany}
        step={step}
        pelangganId={pelanggan?.id}
      />

      {/* modal choose pelanggan  */}
      <ModalChoosePelanggan
        handleChoose={handleSetPelanggan}
        handleShowModal={handleShowModalChoosePelanggan}
        modalRef={modalChoosePelangganRef}
        handleCloseModal={handleCloseModalChoosePelanggan}
      />

      {/* modal add trasaksi */}
      <ModalFormulirTransaksi
        modalRef={modalFormulirTransaksiRef}
        data={dataModalFormulirTransaksi}
        index={idModalUpdateTransaksi}
        handleAppend={handleAddDetails}
        handleCloseModal={handleCloseModalFormulirTransaksi}
      />
    </div>
  );
};
export default PilihProduk;
