import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronsRightIcon,
  CircleAlert,
  PackageCheck,
  PackageX,
  Pencil,
  Phone,
  ReceiptText,
  Trash2,
  Undo2,
  UserRound,
  X,
} from "lucide-react";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import CardStatistikLarge from "../../../components/ui/cards/CardStatistikLarge";
import useReturBarangDetail from "./useReturBarangDetail";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
} from "../../../helpers/helpers";
import { cn } from "../../../utils/cn";
import AlertLabel from "../../../components/messages/AlertLabel";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import ModalFormulirVerifikasiOrPengajuanReturBarang from "../../../components/modals/ModalFormulirVerifikasiOrPengajuanReturBarang";
import {
  RETURN_STATUS,
  ROLE_INTERNAL_TYPE,
} from "../../../types/constant.type";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_RETUR_BARANG_DETAIL } from "../../../types/toast.type";
import SideBarRiwayatPengajuanReturBarang from "../../../components/SideBarRiwayatPengajuanReturBarang";
import ModalAlert from "../../../components/modals/ModalAlert";
import CardProdukTransaksi from "../../../components/ui/cards/CardProdukTransaksi";
import DataEmpty from "../../../components/messages/DataEmpty";
import CardProdukRetur from "../../../components/ui/cards/CardProdukRetur";

const ReturBarangDetail = () => {
  const {
    dataReturBarang,
    isLoadingReturBarang,
    handleBack,
    finalReturDetails,
    summary,
    dataModalFormulirVerifikasiOrPengajuan,
    handleCloseModalFormulirVerifikasiOrPengajuan,
    modalFormulirVerifikasiOrPengajuan,
    handleShowModalFormulirVerifikasiOrPengajuan,
    validatedReturBarangId,
    alert,
    handleSetAlert,
    pengguna,
    toast,
    dataModalKonfirmasiVerifikasi,
    handleCancelModalKonfirmasiVerifikasi,
    handleKonfirmasiModalKonfirmasiVerifikasi,
    handleSetuju,
    isPendingVerifikasiPengajuanReturBarang,
    modalKonfirmasiVerifikasiRef,
    isSomeStokNotEnough,
    handleRedirectUbahData,
  } = useReturBarangDetail();

  return (
    <div className="w-full ">
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_RETUR_BARANG_DETAIL[toast.type].message}
          color={TOAST_CONFIG_RETUR_BARANG_DETAIL[toast.type].color}
        />
      )}
      <div className="w-full flex flex-col justify-start items-start gap-2.5 px-2.5 pt-2.5">
        <ButtonBackText handleClick={() => handleBack()} />
        <div className="w-full bg-base-100 rounded-2xl md:rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2.5 gap-2.5 flex-wrap border border-transparent dark:border-base-content/10 shadow-sm">
          {/* nomor transaksi */}
          <CardStatistikLarge
            icon={{
              largeIcon: Undo2,
              bgColor: "bg-emerald-50 dark:bg-emerald-100",
              textColor: "text-emerald-600",
              smallIcon: Calendar,
            }}
            label="Nomor Referensi Retur"
            largeValue={{
              value: dataReturBarang?.data?.kodeReferensi,
              textColor: "text-emerald-600",
            }}
            smallValue={formatTanggalLengkap(
              dataReturBarang?.data?.tanggalReturn ?? new Date(),
            )}
            customWidth="col-span-1"
            statusRetur={dataReturBarang?.data?.status}
          />

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
              value: dataReturBarang?.data?.transaction.nomorTransaksi,
              textColor: "text-info",
            }}
            smallValue={formatTanggalLengkap(
              dataReturBarang?.data?.transaction.completedAt ?? new Date(),
            )}
            customWidth="col-span-1"
            statusTransaction={dataReturBarang?.data?.transaction.status}
          />

          {/* data created by */}
          <CardStatistikLarge
            icon={{
              largeIcon: UserRound,
              bgColor: "bg-purple-50 dark:bg-purple-100",
              textColor: "text-purple-600",
              smallIcon: CircleAlert,
            }}
            label="Pengajuan oleh"
            largeValue={{
              value: dataReturBarang?.data?.createdBy?.nama,
            }}
            smallValue={"Pengguna yang mengajukan retur barang"}
            customWidth="col-span-1"
            role={dataReturBarang?.data?.createdBy?.role}
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
              value: dataReturBarang?.data?.transaction.pelanggan?.nama,
            }}
            smallValue={formatNumberPhone(
              dataReturBarang?.data?.transaction.pelanggan?.noWa ?? "",
            )}
            customWidth="col-span-1"
            isActive={dataReturBarang?.data?.transaction.pelanggan?.isActive}
          />

          <div className="col-span-1 border border-base-content/10 rounded-2xl md:rounded-xl flex flex-col justify-start items-start gap-0.5 p-2.5">
            {/* label */}
            <span className="text-base-content/70 font-medium text-[0.7rem]">
              Keterangan
            </span>

            {/* keterangan */}
            <span className="text-base-content font-medium text-[0.7rem]">
              {dataReturBarang?.data?.keterangan ?? "-"}
            </span>
          </div>

          <div className="col-span-1 flex flex-row justify-end items-end">
            <SideBarRiwayatPengajuanReturBarang />
          </div>
        </div>

        {/* data */}
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

          {/* FOR DEVICE MOBILE */}
          <div className="w-full flex flex-row justify-start items-start gap-2.5 md:hidden mt-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth p-2.5">
            {isLoadingReturBarang ? (
              <>
                <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
                <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
                <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
              </>
            ) : dataReturBarang?.data &&
              dataReturBarang?.data?.transaction.details.length > 0 ? (
              dataReturBarang?.data?.transaction?.details?.map((item) => (
                <CardProdukTransaksi key={item.id} data={item} />
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

          <div className="md:hidden flex my-4 flex-row justify-center items-center w-full gap-1.5">
            <span className="text-xs text-base-content">
              Silahkan Geser ke kanan
            </span>
            <ChevronsRightIcon className="size-5 text-base-content stroke-1" />
          </div>

          {/* FOR DEVICE MD & LG */}
          <div className="w-full md:flex flex-col justify-start items-start hidden p-2.5">
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
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {isLoadingReturBarang ? (
                    Array.from({ length: 4 }, (_, i) => i).map((item) => (
                      <tr key={item} className="h-18">
                        <td colSpan={8}>
                          <div className="w-full skeleton h-12" />
                        </td>
                      </tr>
                    ))
                  ) : dataReturBarang?.data &&
                    dataReturBarang?.data?.transaction.details.length > 0 ? (
                    <>
                      {dataReturBarang?.data?.transaction.details.map(
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
                            </tr>
                          );
                        },
                      )}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={8}>
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
        {/* alert label */}
        <AlertLabel message="Quantity retur merupakan total barang yang telah memperoleh persetujuan owner dan berhasil diproses sebagai retur." />
        {/* form retur */}
        <div className="w-full flex flex-col justify-start items-start gap-2.5">
          <div
            className={cn(
              "w-full flex flex-col justify-start items-start rounded-xl border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm",
            )}
          >
            {/* title */}
            <div className="w-full flex flex-col justify-start items-start gap-0.5 pt-2.5 px-2.5">
              <h2 className="text-sm font-semibold text-base-content">
                Data retur barang
              </h2>
              <span className="text-base-content text-xs">
                Berisi daftar produk yang diajukan oleh pegawai untuk proses
                retur.
              </span>
            </div>

            {/* FOR DEVICE MOBILE */}
            <div className="w-full flex flex-row justify-start items-start gap-2.5 md:hidden mt-2.5  overflow-x-auto snap-x snap-mandatory scroll-smooth p-2.5">
              {isLoadingReturBarang ? (
                <>
                  <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
                  <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
                  <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
                </>
              ) : finalReturDetails && finalReturDetails.length > 0 ? (
                finalReturDetails.map((item) => (
                  <CardProdukRetur key={item.id} data={item} />
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

            <div className="md:hidden flex my-4 flex-row justify-center items-center w-full gap-1.5">
              <span className="text-xs text-base-content">
                Silahkan Geser ke kanan
              </span>
              <ChevronsRightIcon className="size-5 text-base-content stroke-1" />
            </div>

            {/* FOR DEVICE MB & LG */}
            <div className="w-full md:flex flex-col justify-start items-start gap-2.5 hidden p-2.5">
              <table className="table table-xs">
                {/* head */}
                <thead>
                  <tr className="text-[0.625rem] bg-base-content/5 h-10">
                    <th>No</th>
                    <th>Gambar</th>
                    <th>Nama Produk</th>
                    <th>Harga (Rp)</th>
                    <th>Qty. Barang Bagus</th>
                    <th>Qty. Barang Rusak</th>
                    <th>Qty. Total</th>
                    <th>Total Refund</th>
                    <th>
                      <div className="flex flex-row justify-center items-center">
                        <span>Status</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {isLoadingReturBarang ? (
                    Array.from({ length: 4 }, (_, i) => i).map((item) => (
                      <tr key={item} className="h-18">
                        <td colSpan={7}>
                          <div className="w-full skeleton h-12" />
                        </td>
                      </tr>
                    ))
                  ) : finalReturDetails && finalReturDetails.length > 0 ? (
                    <>
                      {finalReturDetails.map((item, index) => {
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
                                {/* qty */}
                                {formatNumber(item.quantityGood ?? 0)} Pcs
                              </span>
                            </td>
                            <td>
                              <span className="xl:text-[0.7rem] text-base-content">
                                {/* qty */}
                                {formatNumber(item.quantityDamaged ?? 0)} Pcs
                              </span>
                            </td>
                            <td>
                              <span className="xl:text-[0.7rem] text-base-content">
                                {/* qty */}
                                {formatNumber(item.quantityReturn ?? 0)} Pcs
                              </span>
                            </td>
                            <td>
                              <span className="font-medium h-full flex flex-row justify-start items-start xl:text-[0.7rem] text-base-content">
                                {formatRupiah(item.totalRefund ?? 0)}
                              </span>
                            </td>
                            <td>
                              <div className="flex flex-row justify-center items-center">
                                {item.quantity <=
                                (item.quantityReturn ?? 0) + item.totalRetur ? (
                                  <span className="status status-error status-lg" />
                                ) : (
                                  <span className="status status-success status-lg" />
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={8}>
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

          {/* label status */}
          <AlertLabelStatus />

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
                  largeIcon: PackageCheck,
                  bgColor: "bg-emerald-50 dark:bg-emerald-100",
                  textColor: "text-emerald-600",
                }}
                label="Total Barang Bagus"
                largeValue={{
                  value: `${formatNumber(summary.totalBarangBagus)}`,
                }}
                smallValue={"Barang yang dapat dijual kembali"}
                customWidth="col-span-1"
              />

              <CardStatistikLarge
                icon={{
                  largeIcon: PackageX,
                  bgColor: "bg-rose-50 dark:bg-rose-100",
                  textColor: "text-rose-600",
                }}
                label="Total Barang Rusak"
                largeValue={{
                  value: `${formatNumber(summary.totalBarangRusak)}`,
                }}
                smallValue={"Barang yang tidak dapat dijual kembali"}
                customWidth="col-span-1"
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
              />
            </div>

            {/* aksi */}
            <div className="w-full flex flex-row justify-end items-end gap-2.5 mt-2.5">
              {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER &&
                dataReturBarang?.data?.status === RETURN_STATUS.PENDING && (
                  <>
                    {/* batal */}
                    <ButtonWithIcon
                      icon={X}
                      label="Tolak"
                      bgColor="bg-error"
                      textColor="text-primary-white"
                      handleBtn={() =>
                        handleShowModalFormulirVerifikasiOrPengajuan(
                          undefined,
                          {
                            type: "tolak",
                          },
                        )
                      }
                    />

                    {/* simpan dan ajukan */}
                    <ButtonWithIcon
                      disabled={isSomeStokNotEnough}
                      icon={Check}
                      label="Setuju"
                      handleBtn={() => handleSetuju()}
                    />
                  </>
                )}

              {pengguna?.role === ROLE_INTERNAL_TYPE.KASIR &&
                dataReturBarang?.data?.status === RETURN_STATUS.DRAFT && (
                  <>
                    <ButtonWithIcon
                      icon={Trash2}
                      label="Hapus"
                      bgColor="bg-error"
                      textColor="text-primary-white"
                      handleBtn={() => {}}
                    />

                    {/* ajukan */}
                    <ButtonWithIcon
                      icon={Check}
                      label="Ajukan"
                      handleBtn={() =>
                        handleShowModalFormulirVerifikasiOrPengajuan(
                          undefined,
                          {
                            type: "pengajuan",
                          },
                        )
                      }
                    />
                  </>
                )}

              {((pengguna?.role === ROLE_INTERNAL_TYPE.OWNER &&
                dataReturBarang?.data?.status === RETURN_STATUS.REJECTED &&
                dataReturBarang?.data?.createdBy?.id === pengguna?.id) ||
                (pengguna?.role === ROLE_INTERNAL_TYPE.KASIR &&
                  dataReturBarang?.data?.status ===
                    RETURN_STATUS.REJECTED)) && (
                <>
                  <ButtonWithIcon
                    icon={Trash2}
                    label="Hapus"
                    bgColor="bg-error"
                    textColor="text-primary-white"
                    handleBtn={() => {}}
                  />

                  {/* status rejected */}
                  {/* ajukan */}
                  {dataReturBarang?.data?.createdBy?.id === pengguna?.id &&
                    dataReturBarang?.data?.status ===
                      RETURN_STATUS.REJECTED && (
                      <ButtonWithIcon
                        icon={Pencil}
                        bgColor="bg-info"
                        textColor="text-primary-white"
                        label={"Ubah Data"}
                        handleBtn={() => handleRedirectUbahData()}
                      />
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* modal alert */}
      <ModalAlert
        icon={AlertTriangle}
        iconColor="text-warning"
        modalRef={modalKonfirmasiVerifikasiRef}
        bigTitle={dataModalKonfirmasiVerifikasi?.bigTitle ?? ""}
        smallTitle={dataModalKonfirmasiVerifikasi?.smallTitle ?? ""}
        handleCloseModal={handleCancelModalKonfirmasiVerifikasi}
        handleConfirm={handleKonfirmasiModalKonfirmasiVerifikasi}
        labelNext="Lanjutkan"
        isLoading={isPendingVerifikasiPengajuanReturBarang}
      />
      {/* modal verifikasi */}
      <ModalFormulirVerifikasiOrPengajuanReturBarang
        modalRef={modalFormulirVerifikasiOrPengajuan}
        handleCloseModal={handleCloseModalFormulirVerifikasiOrPengajuan}
        handleSetAlert={handleSetAlert}
        kodeReferensi={dataReturBarang?.data?.kodeReferensi ?? ""}
        returId={validatedReturBarangId ?? 0}
        role={pengguna?.role}
        type={dataModalFormulirVerifikasiOrPengajuan?.type}
      />
      {/* modal */}
      {/* <ModalAlert
        icon={AlertTriangle}
        iconColor="text-warning"
        modalRef={modalConfirmRef}
        bigTitle={dataConfirm?.bigTitle ?? ""}
        smallTitle={dataConfirm?.smallTitle ?? ""}
        handleCloseModal={handleCancelConfirm}
        handleConfirm={handleConfirm}
        labelNext="Lanjutkan"
        isLoading={isPendingMutateReturBarang}
      /> */}
    </div>
  );
};

// alert label status
const AlertLabelStatus = () => {
  return (
    <div
      className={cn(
        "w-full gap-2.5 flex flex-row justify-start items-center p-2.5 rounded-2xl md:rounded-xl border ",
        "border-blue-600 bg-blue-600/5",
      )}
    >
      <div className="w-full flex flex-col justify-start items-start gap-1.5">
        <div className="flex flex-row justify-start items-center gap-1.5">
          <span className="status status-error status-md" />

          <span className="text-[0.7rem] text-base-content hidden md:block">
            Status Merah: jumlah yang diretur melebihi jumlah barang yang
            dibeli.
          </span>
          <span className="text-[0.7rem] text-base-content md:hidden">
            Merah: Melebihi jumlah beli.
          </span>
        </div>
        <div className="flex flex-row justify-start items-center gap-1.5">
          <span className="status status-success status-md" />

          <span className="text-[0.7rem] text-base-content hidden md:block">
            Status Hijau: jumlah yang diretur masih sesuai dengan jumlah barang
            yang dibeli.
          </span>

          <span className="text-[0.7rem] text-base-content md:hidden">
            Hijau: Sesuai jumlah beli.
          </span>
        </div>
        <span className="text-[0.7rem] text-base-content hidden md:block">
          Catatan: Retur sebelumnya ikut dihitung dalam pengecekan jumlah retur.
        </span>
        <span className="text-[0.7rem] text-base-content md:hidden">
          Catatan: Retur sebelumnya ikut dihitung.
        </span>
      </div>
    </div>
  );
};

export default ReturBarangDetail;
