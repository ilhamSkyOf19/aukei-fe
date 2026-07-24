import { type FC } from "react";
import ShowProduk from "./ShowProduk";
import {
  ArrowLeftRight,
  CreditCard,
  Dot,
  Minus,
  PackageX,
  Save,
  ShoppingCart,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
  formatRupiahShort,
} from "../../../../helpers/helpers";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import usePilihProduk from "./usePilihProduk";
import ModalChoosePelanggan from "../../../../components/modals/ModalChoosePelanggan";
import Alert from "../../../../components/messages/Alert";
import { ALERT_CONFIG_TRANSACTION } from "../../../../types/alert.types";
import { cn } from "../../../../utils/cn";
import Avatar from "../../../../components/ui/Avatar";
import ModalFormulirTransaksi from "../../../../components/modals/ModalFormulirTransaksi";
import DataEmpty from "../../../../components/messages/DataEmpty";
import ButtonUpdateTable from "../../../../components/ui/button/ButtonUpdateTable";
import ButtonDeleteTable from "../../../../components/ui/button/ButtonDeleteTable";
import ModalAlert from "../../../../components/modals/ModalAlert";

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
    pengguna,
    handleCancelConfirm,
    dataConfirm,
    modalConfirmRef,
    handleConfirm,
  } = usePilihProduk({
    handleSteps,
    handleToast,
  });

  return (
    <div className="w-full h-[95vh] flex flex-row justify-between items-start gap-3">
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_TRANSACTION[alert.type].message}
          full
        />
      )}

      {/* content left */}
      {/* PREVIEW PRODUK TRANSAKSI */}
      <div
        className={cn(
          "w-full flex-3 flex flex-col justify-start items-start rounded-xl bg-base-100 shadow-sm border border-transparent h-full",
          isErrorsFormState.includes("details")
            ? "border-error"
            : "dark:border-base-content/10",
        )}
      >
        {/* pilih pelanggan */}
        <div className="w-full flex-1 p-2.5 flex flex-row justify-between items-center border-b border-base-content/10">
          <div className="w-full flex flex-row justify-between items-center">
            {/* pelanggan */}
            {pelanggan ? (
              <div className="flex flex-row justify-start items-center gap-6">
                <div className="flex flex-row justify-start items-center gap-2">
                  <Avatar
                    nama={pelanggan?.nama ?? ""}
                    index={pelanggan?.id}
                    xs
                  />
                  <div className="flex flex-col justify-start items-start gap-0.5">
                    {/* name */}
                    <span className="text-base-content font-semibold text-xs">
                      {pelanggan?.nama}
                    </span>
                    {/* no telp */}
                    <span className="text-base-content/80 text-[0.625rem]">
                      {formatNumberPhone(pelanggan?.noWa ?? "")}
                    </span>
                  </div>
                </div>

                {/* button ganti pelanggan */}
                <ButtonWithIcon
                  icon={ArrowLeftRight}
                  handleBtn={() => handleShowModalChoosePelanggan()}
                  bgColor="bg-info"
                  textColor="text-primary-white"
                  label="Ganti"
                />
              </div>
            ) : (
              <ButtonWithIcon
                icon={UsersRound}
                label="Pilih Pelanggan"
                handleBtn={() => handleShowModalChoosePelanggan()}
              />
            )}

            {/* kasir */}
            <div
              className={cn(
                "flex flex-row justify-start items-center gap-2 h-10 min-w-28 px-2 rounded-xl border transition-all duration-300 ease-in-out border-base-content/10",
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 dark:border-base-content/10 rounded-lg flex justify-center items-center",
                  isModeKasir
                    ? "border border-primary-white"
                    : "bg-base-300 border border-transparent ",
                )}
              >
                <UserRound
                  className={cn(
                    "size-4",
                    isModeKasir ? "text-primary-white" : "text-base-content",
                  )}
                />
              </div>
              <div className="flex flex-col justify-start items-start">
                <span
                  className={cn(
                    "text-[0.625rem] font-medium",
                    isModeKasir ? "text-primary-white" : "text-base-content/50",
                  )}
                >
                  Kasir
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isModeKasir ? "text-primary-white" : "text-base-content",
                  )}
                >
                  {pengguna?.nama}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* header */}
        <div className="w-full h-6 px-2.5 flex flex-row justify-between items-center my-1.5">
          <h3 className="text-xs font-medium text-base-content">
            {isUpdateKeranjang ? "Ubah Keranjang" : "Data Transaksi"}
          </h3>

          {produkDetails.length > 0 && (
            <button
              type="button"
              className="py-1.5 px-2 flex flex-row justify-start items-center gap-2 border border-transparent hover:border-error rounded-xl transition-all duration-150 ease-in-out"
              onClick={handleRemoveAllDetails}
            >
              <Trash2 className="lg:size-3.5 text-error" />
              <span className="lg:text-[0.625rem] font-medium text-error">
                Kosongkan Semua
              </span>
            </button>
          )}
        </div>

        {/* DATA */}
        <div className="w-full flex-16 px-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-custom-secondary flex flex-col justify-start items-start gap-2.5">
          {produkDetails.length > 0 ? (
            produkDetails?.map((produk) => (
              <CardData
                key={produk.id}
                handleShowModalFormulirTransaksiForUpdate={
                  handleShowModalFormulirTransaksiForUpdate
                }
                removeDetails={removeDetails}
                {...produk}
              />
            ))
          ) : (
            <div className="w-full h-full justify-center items-center">
              <DataEmpty
                iconData={PackageX}
                title="Silahkan Pilih Produk"
                description="Silahkan pilih produk untuk melakukan transaksi"
                xs
              />
            </div>
          )}
        </div>

        {/* total */}
        <div className="w-full flex-1 flex flex-col justify-start items-start p-3 border-t border-custom-secondary/50">
          {/* sub total & total diskon */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5 pb-4 border-b border-base-content/30 border-dashed">
            {/* sub total */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="md:text-xs text-base-content/80">Subtotal</span>
              <span className=" md:text-xs font-semibold text-base-content">
                {formatRupiah(
                  produkDetails.reduce((a, b) => a + b.subTotal, 0),
                )}
              </span>
            </div>

            {/* total diskon */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="md:text-xs text-base-content/80">
                Total Diskon
              </span>
              <div className="flex flex-row justify-start items-center gap-1">
                {produkDetails.reduce((a, b) => a + b.diskon, 0) > 0 && (
                  <span className="md:text-xs font-semibold text-error">
                    <Minus className="size-2" />
                  </span>
                )}

                <span className="md:text-xs font-semibold text-error">
                  {formatRupiah(
                    produkDetails.reduce((a, b) => a + b.diskon, 0),
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* total */}
          <div className="w-full flex flex-row justify-between items-center pt-3 pb-1">
            <span className="md:text-sm font-semibold text-base-content">
              Total
            </span>
            <span className="md:text-base font-semibold text-emerald-600">
              {formatRupiah(
                produkDetails.reduce((a, b) => a + (b.subTotal - b.diskon), 0),
              )}
            </span>
          </div>
        </div>

        {/* button chart and transaksi */}
        {isUpdateKeranjang ? (
          <div className="w-full row-span-1 flex flex-row justify-between items-center gap-4 bg-base-100 border border-transparent dark:border-base-content/10 shadow-sm rounded-xl  xl:p-1 h-12">
            {/* button batalkan */}
            <button
              type="button"
              className="flex flex-row justify-center items-center gap-4 h-full flex-1 rounded-xl border border-custom-primary hover-overlay"
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
                "flex flex-row justify-center items-center gap-4 h-full border border-custom-primary flex-1 rounded-xl bg-custom-primary disabled:opacity-50",
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
              "w-full row-span-1 flex flex-row justify-between items-center xl:p-1 h-12 tooltip",
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
                "flex-1 flex flex-row justify-center items-center gap-4 xl:h-full rounded-xl border border-custom-primary disabled:opacity-50",
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
                  <span className="text-base-content md:text-[0.7rem] font-semibold">
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
                  className="flex flex-row justify-center items-center gap-4 h-full flex-1 rounded-xl bg-error hover-overlay "
                  onClick={() => {
                    handleBatalkanUpdateTransaction();
                  }}
                >
                  <>
                    {/* icon */}
                    <X className="size-4 text-primary-white" />
                    <span className="text-primary-white text-[0.7rem] font-semibold">
                      Batalkan
                    </span>
                  </>
                </button>
              )}

              <button
                type="button"
                disabled={produkDetails?.length === 0 || !pelanggan}
                className={cn(
                  "flex flex-row justify-center items-center gap-4 h-full border border-custom-primary flex-1 rounded-xl bg-custom-primary disabled:opacity-50",
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
                  <CreditCard className="size-4 text-custom-secondary" />
                )}
                <span className="text-custom-secondary text-[0.7rem] font-semibold">
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
        dataChooseProduk={produkDetails}
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

      {/* alert */}
      <ModalAlert
        modalRef={modalConfirmRef}
        bigTitle={dataConfirm?.title ?? ""}
        smallTitle={dataConfirm?.deskripsi ?? ""}
        handleCloseModal={handleCancelConfirm}
        handleConfirm={handleConfirm}
        labelNext="Lanjutkan"
      />
    </div>
  );
};

// card data
type CardDataProps = {
  id: number;
  img: string;
  nama: string;
  kode: string;
  stok: number;
  quantity: number;
  hargaJual: number;
  subTotal: number;
  handleShowModalFormulirTransaksiForUpdate: (id: number) => void;
  removeDetails: (id: number) => void;
};
const CardData: FC<CardDataProps> = ({
  handleShowModalFormulirTransaksiForUpdate,
  removeDetails,
  ...produk
}) => {
  return (
    <div className="w-full flex flex-row justify-between items-center border-b border-base-content/10 pb-2.5">
      {/* content 1 */}
      <div className="flex-1 flex flex-row justify-start items-center gap-4">
        {/* img */}
        <div className="w-8 h-8 rounded-lg overflow-hidden flex justify-center items-center">
          <img src={produk.img} alt="foto produk" />
        </div>

        {/* nama dan kode */}
        <div className="flex flex-col justify-start items-start gap-0.5">
          <div className="flex flex-row justify-start items-start gap-2">
            <span className="text-[0.7rem] font-semibold text-base-content">
              {produk.nama}
            </span>
            {produk.stok < produk.quantity && (
              <span className="text-[0.625rem] font-medium text-error">
                stok kurang
              </span>
            )}
          </div>
          <div className="flex flex-row justify-start items-center gap-0.5">
            <span className="text-[0.625rem] font-medium text-base-content/50">
              {produk.kode}
            </span>
            <span className="text-xs font-medium text-base-content/50">
              <Dot className="size-4" />
            </span>
            <span className="text-[0.625rem] font-medium text-base-content">
              {formatRupiah(produk.hargaJual)}
            </span>
          </div>
        </div>
      </div>

      {/* content 2 */}
      <div className="flex-1 grid grid-cols-4 gap-0.5 justify-end items-center">
        {/* quantity */}
        <span className="col-span-1 text-center text-[0.625rem] font-semibold text-base-content">
          {formatNumber(produk.quantity)} x
        </span>

        {/* sub total */}
        <span className="col-span-2 text-xs font-medium text-base-content">
          {produk.subTotal > 1500000
            ? formatRupiahShort(produk.subTotal)
            : formatRupiah(produk.subTotal)}
        </span>

        {/* aksi */}
        <div className="col-span-1 flex flex-row justify-end items-start gap-1">
          <ButtonUpdateTable
            handleShowModalFormulir={() =>
              handleShowModalFormulirTransaksiForUpdate(produk.id)
            }
            noTip
          />
          <ButtonDeleteTable
            handleShowModalDelete={() => removeDetails(produk.id)}
            noTip
          />
        </div>
      </div>
    </div>
  );
};

export default PilihProduk;
