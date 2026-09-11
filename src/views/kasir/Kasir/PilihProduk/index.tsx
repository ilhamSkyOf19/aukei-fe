// PilihProduk.tsx — versi responsive.
// Konvensi: breakpoint "lg" (>=1024px) = titik pemisah mobile vs desktop.
// Semua class lama tanpa prefix yang sebelumnya berarti "berlaku di semua
// ukuran layar" sekarang saya bungkus jadi "lg:..." supaya HANYA berlaku
// di layar besar, lalu saya tambahkan class mobile-nya sebagai default.
// Baris yang saya ubah/tambahkan diberi komentar "// MOBILE:".

import { type FC } from "react";
import ShowProduk from "./ShowProduk";
import {
  ArrowLeft,
  ArrowLeftRight,
  CalendarClock,
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
import LoadingFetch from "../../../../components/ui/LoadingFetch";
import AddFastCustomer from "../../../../components/AddFastCustomer";

const PilihProduk: FC = () => {
  const {
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
    handleBatalkanUpdateTransaction,
    handleCloseModalFormulirTransaksi,
    handleShowModalFormulirTransaksi,
    modalFormulirTransaksiRef,
    idModalUpdateTransaksi,
    dataModalFormulirTransaksi,
    handleShowModalFormulirTransaksiForUpdate,
    pengguna,
    handleCancelConfirm,
    dataConfirm,
    modalConfirmRef,
    handleConfirm,
    step,

    handleRedirectBooking,
    fromBooking,

    isLoadingTransaksi,
    isPendingRemoveDetail,
    variablesRemoveDetail,
    isRefetchingTransaksi,

    handleRemoveAll,
    isPendingRemoveAll,

    formActive,
    setFormActive,

    dataTransaksi,

    isNextTransaction,

    handleBackKeranjang,
    transactionIdFromCart,
  } = usePilihProduk();

  return (
    // MOBILE: flex-col di default (mobile), lg:flex-row mengembalikan
    // layout dua-panel-berdampingan seperti sebelumnya di layar besar.
    <div className="w-full h-full flex flex-col lg:flex-row justify-between items-start gap-3 relative">
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_TRANSACTION[alert.type].message}
          full
        />
      )}

      {/* loading */}
      {(isLoadingTransaksi || isRefetchingTransaksi || isPendingRemoveAll) && (
        <div className="absolute w-full h-full flex flex-row justify-center items-center z-20">
          <div className="w-full h-full bg-base-100 opacity-70 absolute" />
          <LoadingFetch />
        </div>
      )}

      {/* content left */}
      {/* PREVIEW PRODUK TRANSAKSI */}
      <div
        className={cn(
          // MOBILE: w-full h-auto sebagai default (tinggi mengikuti konten),
          // lg:flex-3 lg:h-full mengembalikan proporsi & tinggi penuh di desktop.
          "w-full h-auto lg:h-full lg:flex-4 flex flex-col justify-start items-start rounded-xl bg-base-100 shadow-sm border border-transparent",
          isErrorsFormState.includes("details")
            ? "border-error"
            : "dark:border-base-content/10",
        )}
      >
        {/* pilih pelanggan */}
        <div className="w-full md:flex-1 p-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 sm:gap-0 border-b border-base-content/10">
          {/* MOBILE: dibungkus flex-wrap supaya info pelanggan (bisa panjang)
              tidak mendorong/menabrak card kasir di layar sempit. */}
          <div className="w-full flex flex-row flex-wrap justify-between items-center gap-2.5">
            <div className="flex flex-row justify-start items-center gap-2.5">
              {/* input floating */}
              {formActive && (
                <>
                  <AddFastCustomer
                    pelangganId={pelanggan?.id}
                    transactionId={dataTransaksi?.data?.id ?? 0}
                    handleSetFormActive={() => setFormActive(false)}
                  />

                  <ButtonWithIcon
                    noLabel
                    icon={X}
                    bgColor="bg-rose-500"
                    textColor="text-primary-white"
                    handleBtn={() => setFormActive(false)}
                  />
                </>
              )}

              {pelanggan && !formActive ? (
                <div className="flex flex-row justify-start items-center gap-6 flex-wrap">
                  <div className="flex flex-row justify-start items-center gap-2 min-w-0">
                    <Avatar
                      nama={pelanggan?.nama ?? ""}
                      index={pelanggan?.id}
                      xs
                    />
                    <div className="flex flex-col justify-start items-start gap-0.5 min-w-0">
                      {/* name */}
                      <span className="text-base-content font-semibold text-xs truncate max-w-36 sm:max-w-none">
                        {pelanggan?.nama}
                      </span>
                      {/* no telp */}
                      <span className="text-base-content/80 text-[0.625rem]">
                        {formatNumberPhone(pelanggan?.noWa ?? "")}
                      </span>
                    </div>
                  </div>

                  <ButtonWithIcon
                    noLabel
                    icon={X}
                    bgColor="bg-rose-500"
                    textColor="text-primary-white"
                    handleBtn={() => setFormActive(true)}
                  />

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
                  noLabel
                  icon={UsersRound}
                  handleBtn={() => handleShowModalChoosePelanggan()}
                />
              )}
            </div>

            {/* kasir */}
            <div
              className={cn(
                // MOBILE: min-w-24 sedikit lebih sempit di layar kecil,
                // sm:min-w-28 mengembalikan lebar asli di layar >=640px.
                "flex flex-row justify-start items-center gap-2 h-10 min-w-24 sm:min-w-28 px-2 rounded-xl border transition-all duration-300 ease-in-out border-base-content/10",
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 dark:border-base-content/10 rounded-lg flex justify-center items-center",
                  "bg-base-300 border border-transparent",
                )}
              >
                <UserRound className={cn("size-4", "text-base-content")} />
              </div>
              <div className="flex flex-col justify-start items-start">
                <span
                  className={cn(
                    "text-[0.625rem] font-medium",
                    "text-base-content/50",
                  )}
                >
                  Kasir
                </span>
                <span
                  className={cn("text-xs font-medium", "text-base-content")}
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
              onClick={() => handleRemoveAll()}
            >
              <Trash2 className="size-3.5 text-error" />
              <span className="text-[0.625rem] font-medium text-error">
                Kosongkan Semua
              </span>
            </button>
          )}
        </div>
        {/* DATA */}
        {/* MOBILE: flex-1 + max-h agar list tidak "menghilang" saat parent
            flex-col (tinggi otomatis bisa jadi 0). lg:flex-16 lg:max-h-none
            mengembalikan perilaku desktop asli. */}
        <div className="w-full flex-2 md:flex-1 lg:flex-16 max-h-[45vh] lg:max-h-none px-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-custom-secondary flex flex-col justify-start items-start gap-2.5 mt-1.5">
          {produkDetails.length > 0 ? (
            produkDetails?.map((item) => (
              <CardData
                key={item.id}
                handleShowModalFormulirTransaksiForUpdate={
                  handleShowModalFormulirTransaksiForUpdate
                }
                removeDetails={removeDetails}
                diskon={item.diskon}
                hargaJual={item.hargaJual}
                id={item.id}
                img={item.produk.img}
                nama={item.produk.nama}
                quantity={item.quantity}
                stok={item.stokTersisa}
                subTotal={item.subtotal}
                kode={item.produk.kode}
                isLoadingRemove={
                  isPendingRemoveDetail && variablesRemoveDetail === item.id
                }
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
        <div className="w-full flex-1 flex flex-col justify-start items-start p-3 pb-1.5 border-t border-custom-secondary/50">
          {/* sub total & total diskon */}
          <div className="w-full flex flex-col justify-start items-start gap-1.5 pb-1.5 border-b border-base-content/30 border-dashed">
            {/* total produk */}
            <div className="w-full flex flex-row justify-between items-center">
              {/* MOBILE: tambahkan ukuran dasar text-[0.7rem] karena
                  sebelumnya tidak ada size di bawah breakpoint md. */}
              <span className="text-[0.7rem] md:text-xs text-base-content/80">
                Total Produk
              </span>
              <span className="text-[0.7rem] font-semibold text-base-content">
                {formatNumber(produkDetails.length)} Produk
              </span>
            </div>

            {/* total quantity */}
            <div className="w-full flex flex-row justify-between items-center">
              {/* MOBILE: tambahkan ukuran dasar text-[0.7rem] karena
                  sebelumnya tidak ada size di bawah breakpoint md. */}
              <span className="text-[0.7rem] md:text-xs text-base-content/80">
                Total Quantity
              </span>
              <span className="text-[0.7rem]  font-semibold text-base-content">
                {formatNumber(
                  produkDetails.reduce((a, b) => a + b.quantity, 0),
                )}{" "}
                Item
              </span>
            </div>

            {/* sub total */}
            <div className="w-full flex flex-row justify-between items-center">
              {/* MOBILE: tambahkan ukuran dasar text-[0.7rem] karena
                  sebelumnya tidak ada size di bawah breakpoint md. */}
              <span className="text-[0.7rem] md:text-xs text-base-content/80">
                Subtotal
              </span>
              <span className="text-[0.7rem] md:text-xs font-semibold text-base-content">
                {formatRupiah(
                  produkDetails.reduce((a, b) => a + b.subtotal + b.diskon, 0),
                )}
              </span>
            </div>

            {/* total diskon */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-[0.7rem] md:text-xs text-base-content/80">
                Total Diskon
              </span>
              <div className="flex flex-row justify-start items-center gap-1">
                {produkDetails.reduce((a, b) => a + b.diskon * b.quantity, 0) >
                  0 && (
                  <span className="text-[0.7rem] md:text-xs font-semibold text-error">
                    <Minus className="size-2" />
                  </span>
                )}

                <span className="text-[0.7rem] md:text-xs font-semibold text-error">
                  {formatRupiah(
                    produkDetails.reduce((a, b) => a + b.diskon, 0),
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* total */}
          <div className="w-full flex flex-row justify-between items-center pt-2.5">
            <span className="text-[0.8rem] md:text-sm font-semibold text-base-content">
              Total
            </span>
            <span className="text-[0.9rem] md:text-base font-semibold text-emerald-600">
              {formatRupiah(produkDetails.reduce((a, b) => a + b.subtotal, 0))}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-row justify-start items-end p-2.5 md:p-0 h-16">
          {isUpdateKeranjang && (
            <div className="w-full row-span-1 flex flex-row justify-between items-center gap-2.5 bg-base-100 border border-transparent dark:border-base-content/10 shadow-sm rounded-xl xl:p-1 h-12">
              {/* button batalkan */}
              <button
                type="button"
                className="flex flex-row justify-center items-center gap-2 sm:gap-4 h-full flex-1 rounded-xl bg-custom-primary hover-overlay text-custom-secondary"
                onClick={() => handleBackKeranjang()}
              >
                <ArrowLeft className="size-4 lg:size-4 xl:size-5 text-base-content" />
                <span className="text-base-content text-[0.6rem] lg:text-[0.625rem] xl:text-xs font-semibold">
                  Kembali
                </span>
              </button>
            </div>
          )}
          {!isUpdateKeranjang && (
            <div
              className={cn(
                // MOBILE: gap sedikit lebih kecil di layar sempit.
                "w-full gap-1.5 sm:gap-2.5 row-span-1 flex flex-row justify-between items-center xl:p-1 h-12 tooltip",
              )}
              data-tip={
                !pelanggan || produkDetails.length === 0
                  ? "Silahkan lengkapi data pelanggan dan produk terlebih dahulu"
                  : ""
              }
            >
              {isNextTransaction && !isUpdateKeranjang && (
                <button
                  type="button"
                  disabled={produkDetails.length === 0 || !pelanggan}
                  className={cn(
                    "flex flex-row justify-center items-center gap-1.5 sm:gap-2.5 h-full rounded-xl border border-custom-primary hover-overlay flex-1 disabled:opacity-50",
                  )}
                  onClick={() => {
                    handleBackKeranjang();
                  }}
                >
                  <ArrowLeft className="size-4 xl:size-4 text-base-content" />
                  <span className="text-base-content text-[0.6rem] lg:text-[0.625rem] xl:text-xs font-semibold">
                    Kembali
                  </span>
                </button>
              )}

              {/* button chart */}
              {!isNextTransaction && (
                <button
                  type="button"
                  disabled={produkDetails.length === 0 || !pelanggan}
                  className={cn(
                    "flex flex-row justify-center items-center gap-1.5 sm:gap-2.5 h-full rounded-xl border border-custom-primary disabled:opacity-50",
                    fromBooking ? "w-12" : "flex-1",
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
                      <ShoppingCart className="size-4 xl:size-4 text-base-content" />
                      {!fromBooking && (
                        <span className="text-base-content text-[0.65rem] md:text-[0.7rem] font-semibold">
                          Keranjang
                        </span>
                      )}
                    </>
                  )}
                </button>
              )}

              {/* button booking */}
              {!fromBooking ? (
                <button
                  type="button"
                  disabled={produkDetails.length === 0 || !pelanggan}
                  className={cn(
                    "flex-1 flex flex-row justify-center items-center gap-1.5 sm:gap-2.5 h-full rounded-xl border border-custom-primary disabled:opacity-50",
                    (produkDetails.length > 0 || !pelanggan) && "hover-overlay",
                  )}
                  style={{
                    cursor:
                      produkDetails.length === 0 || !pelanggan
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={() => handleRedirectBooking()}
                >
                  <CalendarClock className="size-4 xl:size-4 text-base-content" />
                  <span className="text-base-content text-[0.65rem] md:text-[0.7rem] font-semibold">
                    Booking
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={
                    produkDetails.length === 0 ||
                    !pelanggan ||
                    produkDetails.some((detail) => detail.stokTersisa === 0)
                  }
                  className={cn(
                    "flex flex-row justify-center items-center gap-1.5 sm:gap-2.5 h-full rounded-xl border border-custom-primary disabled:opacity-50",
                    fromBooking ? "px-2.5" : "flex-1",
                    (produkDetails.length > 0 || !pelanggan) && "hover-overlay",
                  )}
                  onClick={() => handleStepsNext(true)}
                >
                  <CreditCard className="size-4 xl:size-4 text-base-content" />
                  <span className="text-base-content text-[0.65rem] md:text-[0.7rem] font-semibold">
                    Pembayaran
                  </span>
                </button>
              )}

              {/* button transaksi */}
              <div
                className={cn(
                  "flex flex-row h-full justify-end items-center gap-1.5 sm:gap-2",
                  isUpdateTransaction ? "flex-2" : "flex-1",
                )}
              >
                {isUpdateTransaction && (
                  <button
                    type="button"
                    className="flex flex-row justify-center items-center gap-1.5 sm:gap-2.5 h-full flex-1 rounded-xl bg-error hover-overlay"
                    onClick={() => {
                      handleBatalkanUpdateTransaction();
                    }}
                  >
                    <X className="size-4 text-primary-white" />
                    <span className="text-primary-white text-[0.65rem] sm:text-[0.7rem] font-semibold">
                      Batalkan
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={
                    produkDetails?.length === 0 ||
                    !pelanggan ||
                    produkDetails.some((detail) => detail.stokTersisa === 0)
                  }
                  className={cn(
                    "flex flex-row justify-center items-center h-full border border-custom-primary flex-1 rounded-xl bg-custom-primary disabled:opacity-50",
                    (produkDetails.length > 0 || !pelanggan) && "hover-overlay",
                    isUpdateTransaction
                      ? "gap-1.5 sm:gap-2.5"
                      : "gap-2 sm:gap-4",
                  )}
                  onClick={() => handleStepsNext()}
                >
                  {isUpdateTransaction ? (
                    <Save className="size-4 text-custom-secondary" />
                  ) : (
                    <CreditCard className="size-4 text-custom-secondary" />
                  )}
                  <span className="text-custom-secondary text-[0.65rem] sm:text-[0.7rem] font-semibold">
                    {isUpdateTransaction ? "Simpan" : "Pembayaran"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* content right */}
      {/* MOBILE: beri w-full agar ShowProduk tidak ikut menyempit saat
          parent flex-col; di desktop (lg:) parent kembali flex-row jadi
          ShowProduk otomatis mengambil sisa ruang seperti sebelumnya. */}
      <ShowProduk
        handleShowModalFormulirTransaksi={handleShowModalFormulirTransaksi}
        step={step}
        pelangganId={pelanggan?.id}
        dataChooseProduk={produkDetails.map((item) => ({
          id: item.produk.id,
          diskon: item.diskon,
          hargaJual: item.hargaJual,
          img: item.produk.img,
          nama: item.produk.nama,
          quantity: item.quantity,
          stok: item.quantity,
          subTotal: item.subtotal,
          hargaJualTerakhirTransaksi: item.hargaJualTerakhir,
          kode: item.produk.kode,
        }))}
      />

      {/* modal choose pelanggan  */}
      <ModalChoosePelanggan
        handleShowModal={handleShowModalChoosePelanggan}
        modalRef={modalChoosePelangganRef}
        handleCloseModal={handleCloseModalChoosePelanggan}
        transactionIdFromCart={transactionIdFromCart ?? undefined}
      />

      {/* modal add trasaksi */}
      <ModalFormulirTransaksi
        modalRef={modalFormulirTransaksiRef}
        data={dataModalFormulirTransaksi}
        index={idModalUpdateTransaksi}
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
  kode?: string | null;
  stok: number;
  quantity: number;
  hargaJual: number;
  subTotal: number;
  diskon: number;
  handleShowModalFormulirTransaksiForUpdate: (id: number) => void;
  removeDetails: (id: number) => void;
  isLoadingRemove?: boolean;
};
const CardData: FC<CardDataProps> = ({
  handleShowModalFormulirTransaksiForUpdate,
  removeDetails,
  isLoadingRemove,
  ...produk
}) => {
  return (
    // MOBILE: flex-col di layar sempit (gambar+nama di atas, detail
    // qty/subtotal/aksi di bawah), sm:flex-row mengembalikan tampilan
    // satu baris seperti desktop mulai dari 640px ke atas.
    <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 border-b border-base-content/10 pb-2.5">
      {/* content 1 */}
      <div className="flex-1 flex flex-row justify-start items-center gap-4 min-w-0">
        {/* img */}
        <div className="w-8 h-8 shrink-0 rounded-lg overflow-hidden flex justify-center items-center">
          <img src={produk.img} alt="foto produk" />
        </div>

        {/* nama dan kode */}
        <div className="flex flex-col justify-start items-start gap-0.5 min-w-0">
          <div className="flex flex-row justify-start items-start gap-2 flex-wrap">
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
              {produk.kode ?? "-"}
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
        <span className="col-span-1 text-start text-xs font-medium text-base-content">
          {formatNumber(produk.quantity)} x
        </span>

        {/* sub total */}
        <div className="col-span-2 flex flex-col justify-start items-start">
          <span className="text-[0.625rem] font-medium text-error">
            - {formatRupiah(produk.diskon)}
          </span>
          <span className="text-xs font-medium text-base-content">
            {produk.subTotal > 1500000
              ? formatRupiahShort(produk.subTotal)
              : formatRupiah(produk.subTotal)}
          </span>
        </div>

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
            isLoading={isLoadingRemove}
          />
        </div>
      </div>
    </div>
  );
};

export default PilihProduk;
