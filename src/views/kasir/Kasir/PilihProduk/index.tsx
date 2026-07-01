import { type FC } from "react";
import ShowProduk from "./ShowProduk";
import {
  Minus,
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

type Props = {
  step: number;
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
  isUpdateKeranjangFromRoute?: boolean;
};
const PilihProduk: FC<Props> = ({
  handleSteps,
  step,
  handleToast,
  isUpdateKeranjangFromRoute,
}) => {
  // call use
  const {
    handleAddDetails,
    handleRemoveAll,
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
    isUpdate,
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
  } = usePilihProduk({
    handleSteps,
    step,
    handleToast,
    isUpdateKeranjangFromRoute,
  });

  return (
    <div className="w-full flex flex-row justify-between items-start gap-3">
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_TRANSACTION[alert.type].message}
        />
      )}

      {/* content left */}
      <div className="w-full flex-1 flex flex-col justify-start items-start gap-3">
        {/* pelanggan */}
        {!isUpdateKeranjang && (
          <div
            className={cn(
              "w-full flex flex-row justify-between items-center border rounded-lg py-2.5 px-3 bg-custom-surface border-custom-border",
              isErrorsFormState.includes("pelanggan")
                ? "border-error"
                : "border-base-content/10",
            )}
          >
            {/* avatar, name, no telp */}
            <div className="flex-1 flex flex-row justify-start items-center gap-3">
              {!pelanggan ? (
                <span className="text-sm text-primary-white font-medium">
                  Silahkan pilih pelanggan
                </span>
              ) : (
                <>
                  {/* avatar */}
                  <Avatar nama={pelanggan?.nama} />
                  <div className="flex flex-col justify-start items-start gap-1">
                    {/* name */}
                    <span className="text-primary-white font-medium text-sm">
                      {pelanggan?.nama}
                    </span>
                    {/* no telp */}
                    <div className="w-full flex flex-row justify-start items-center gap-2">
                      <Phone className="size-3 text-primary-white" />
                      <span className="text-primary-white font-semibold text-xs">
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
          <div className="w-full flex flex-row justify-between items-center px-4 py-3">
            <h3 className="text-sm font-medium text-base-content">
              {isUpdateKeranjang ? "Ubah Keranjang" : "Data Transaksi"}
            </h3>

            {produkDetails.length > 0 && (
              <button
                type="button"
                className="py-1.5 px-2 flex flex-row justify-start items-center gap-2 border border-transparent hover:border-error rounded-md transition-all duration-150 ease-in-out"
                onClick={handleRemoveAll}
              >
                <Trash2 className="size-4 text-error" />
                <span className="text-[0.7rem] font-medium text-error">
                  Kosongkan Semua
                </span>
              </button>
            )}
          </div>

          {/* data */}
          <div className="w-full flex flex-col justify-start items-start pb-6">
            <div className="overflow-x-auto w-full">
              <table className="table table-xs table-zebra">
                {/* head */}
                <thead>
                  <tr className="text-[0.625rem] bg-base-content/5">
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
                            <div className="mask mask-squircle h-10 w-10">
                              <img src={item.img} alt="gambar produk" />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col justify-start items-start gap-px">
                            <p>{item.nama}</p>
                            <span className="font-medium text-base-content/50">
                              {item.kode}
                            </span>
                          </div>
                        </td>
                        <td>
                          {item.hargaJualTerakhirTransaksi
                            ? formatRupiah(item.hargaJualTerakhirTransaksi)
                            : "-"}
                        </td>
                        <td>
                          {/* harga jual */}
                          {formatRupiah(item.hargaJual)}
                        </td>
                        <td>{formatRupiah(item.diskon)}</td>
                        <td>
                          {/* qty */}
                          {item.quantity} x
                        </td>
                        <td className="h-full">
                          {formatRupiah(item.subTotal - item.diskon)}
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
                        <div className="w-full flex flex-row justify-center items-center pt-10">
                          <span className="text-sm text-base-content/50">
                            Silahkan pilih produk
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

        {/* total */}
        <div className="w-full flex flex-col justify-start items-start rounded-lg border border-base-content/10 px-3 py-4 bg-base-100 shadow-sm">
          {/* sub total & total diskon */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5 pb-4 border-b border-base-content/10">
            {/* sub total */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs font-medium text-base-content/60">
                Subtotal
              </span>
              <span className="text-xs font-medium text-base-content">
                {formatRupiah(
                  produkDetails.reduce((a, b) => a + b.subTotal, 0),
                )}
              </span>
            </div>

            {/* total diskon */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs font-medium text-base-content/60">
                Total Diskon
              </span>
              <div className="flex flex-row justify-start items-center gap-1">
                {produkDetails.reduce((a, b) => a + b.diskon, 0) > 0 && (
                  <span className="text-xs font-medium text-error">
                    <Minus className="size-2" />
                  </span>
                )}

                <span className="text-xs font-medium text-error">
                  {formatRupiah(
                    produkDetails.reduce((a, b) => a + b.diskon, 0),
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* total */}
          <div className="w-full flex flex-row justify-between items-center pt-4 pb-1">
            <span className="text-sm font-medium text-base-content">Total</span>
            <span className="text-base font-medium text-emerald-600">
              {formatRupiah(
                produkDetails.reduce((a, b) => a + (b.subTotal - b.diskon), 0),
              )}
            </span>
          </div>
        </div>

        {/* button chart and transaksi */}
        {isUpdateKeranjang ? (
          <div className="w-full flex flex-row justify-between items-center gap-4 ">
            {/* button batalkan */}
            <button
              type="button"
              className="flex flex-row justify-center items-center gap-4 h-12 flex-1 rounded-lg border border-custom-primary hover-overlay hover:border-base-content/10"
              onClick={() => handleBatalkanSimpanKeranjang()}
            >
              <X className="size-5 text-base-content" />
              <span className="text-base-content text-xs font-semibold">
                Batalkan
              </span>
            </button>

            {/* simpan */}
            <button
              type="button"
              className="flex flex-row justify-center items-center gap-4 h-12 border border-custom-primary flex-1 rounded-lg bg-custom-primary hover-overlay"
              onClick={() => handleSimpanPerubahanKeranjang()}
            >
              {isPendingKeranjang ? (
                <div className="loading loading-sm text-custom-secondary" />
              ) : (
                <>
                  {/* icon */}
                  <Save className="size-4 text-custom-secondary" />
                  <span className="text-custom-secondary text-xs font-semibold">
                    Simpan Perubahan
                  </span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-row justify-between items-center gap-4 bg-custom-surface shadow-sm rounded-lg p-3">
            {/* button chart */}
            <button
              type="button"
              className="flex flex-row justify-center items-center gap-4 h-12 flex-1 rounded-lg border border-custom-primary hover-overlay "
              onClick={() => {
                isUpdate
                  ? handleBatalkanUpdateTransaction()
                  : handleSimpanKeranjang();
              }}
            >
              {isPendingKeranjang ? (
                <div className="loading loading-sm text-base-content" />
              ) : (
                <>
                  {/* icon */}
                  {isUpdate ? (
                    <X className="size-5 text-primary-white" />
                  ) : (
                    <ShoppingCart className="size-5 text-primary-white" />
                  )}
                  <span className="text-primary-white text-xs font-semibold">
                    {isUpdate ? "Batalkan" : "Masukan ke Keranjang"}
                  </span>
                </>
              )}
            </button>
            <button
              type="button"
              className="flex flex-row justify-center items-center gap-4 h-12 border border-custom-primary flex-1 rounded-lg bg-custom-primary hover-overlay"
              onClick={handleStepsNext}
            >
              {/* icon */}
              {isUpdate ? (
                <Save className="size-4 text-custom-secondary" />
              ) : (
                <Receipt className="size-4 text-custom-secondary" />
              )}
              <span className="text-custom-secondary text-xs font-semibold">
                {isUpdate ? "Simpan Transaksi" : "Buat Transaksi"}
              </span>
            </button>
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
