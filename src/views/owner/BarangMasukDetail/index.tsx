import {
  BanknoteArrowDown,
  CalendarDays,
  Check,
  Package,
  Printer,
  TextAlignStart,
} from "lucide-react";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import StatusInventori from "../../../components/ui/StatusInventori";
import { STATUS_INVENTORI_TYPE } from "../../../types/constant.type";
import useBarangMasukDetail from "./useBarangMasukDetail";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import { cn } from "../../../utils/cn";
import { formatRupiah } from "../../../helpers/helpers";
import ShowDataBarangMasuk from "./ShowBarangMasuk";
import InputSearch from "../../../components/inputs/InputSearch";
import InputNumber from "../../../components/inputs/InputNumber";
import ButtonSubmitWithIcon from "../../../components/ui/button/ButtonSubmitWithIcon";
import Alert from "../../../components/messages/Alert";
import {
  ALERT_CONFIG_BARANG_MASUK_DETAIL,
  ALERT_CONFIG_KATEGORI_PRODUK,
} from "../../../types/alert.types";

const BarangMasukDetail = () => {
  // call use barang masuk detail
  const {
    dataBarangMasukDetail,
    isLoadingBarangMasukDetail,
    handleSearch,
    dataProdukForChoose,
    errors,
    handleSetValueProdukId,
    handleSubmit,
    isPendingBarangMasukDetail,
    onSubmit,
    alert,
    register,
    produkChoose,
    wrapperRef,
    activeComponentChooseProduk,
    handleShowActiveComponentChooseProduk,
    isLoadingProdukForChoose,
    handleCloseActiveComponentChooseProduk,
  } = useBarangMasukDetail();

  return (
    <div className="w-full flex flex-col justify-start items-start pt-4 px-2.5 gap-4 pb-70">
      {/* alert */}
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_BARANG_MASUK_DETAIL[alert.type].message}
        />
      )}

      {/* header */}
      <div className="card bg-base-100 shadow-xs dark:border dark:border-base-content/10 w-full flex flex-col justify-start p-2 lg:p-4">
        {/* button back */}
        <div className="w-30">
          <ButtonBackText label="Kembali" />
        </div>

        {isLoadingBarangMasukDetail ? (
          <>
            <div className="w-80 h-8 skeleton mt-4" />
            <div className="w-50 h-4 skeleton mt-2" />
            <div className="w-30 h-7 skeleton mt-2" />
            <div className="w-full h-7 skeleton mt-2" />
          </>
        ) : (
          <div className="w-full flex flex-col lg:flex-row justify-start items-start lg:items-center">
            {/* kode and status */}
            <div className="flex lg:flex-1 flex-col justify-start items-start">
              <div className="w-full px-2 flex flex-row justify-start items-start gap-2 mt-4">
                <h2 className="text-base-content text-lg lg:text-xl font-semibold">
                  {dataBarangMasukDetail?.data?.kodeReferensi}
                </h2>

                {/* status */}
                <StatusInventori
                  status={
                    dataBarangMasukDetail?.data?.status ??
                    STATUS_INVENTORI_TYPE.DRAFT
                  }
                />
              </div>

              {/* tanggal */}
              <div className="px-2 mt-2">
                <p className="text-xs text-base-content">
                  Dibuat pada tanggal{" "}
                  <span className="font-medium">
                    {formatTanggalLengkap(
                      dataBarangMasukDetail?.data?.createdAt ?? new Date(),
                    )}
                  </span>
                </p>
              </div>
            </div>

            <div className="w-full lg:flex-1 flex flex-col lg:flex-row justify-start items-start lg:items-center lg:justify-end">
              {/* button */}
              <div className="w-full lg:w-auto px-2 flex flex-row justify-start items-start gap-2 mt-6 lg:mt-0">
                <ButtonWithIcon
                  textColor="text-primary-white"
                  label="Cetak"
                  icon={Printer}
                  bgColor="bg-info"
                />
              </div>

              {/* button posting */}
              <button
                type="button"
                className="w-full lg:w-40 flex flex-row justify-center items-center h-9 lg:h-8.5 rounded-md bg-custom-primary text-custom-secondary mt-4 lg:mt-0 gap-2 hover-overlay"
              >
                {false ? (
                  <div className="loading loading-xs text-custom-secondary" />
                ) : (
                  <>
                    <Check className="size-4" />
                    <span className="text-xs font-medium">
                      Posting Sekarang
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* informasi tanggal dan keterangan */}
      <div className="w-full flex flex-col justify-start items-center lg:items-start lg:flex-row gap-4">
        <div className="card bg-base-100 shadow-xs dark:border dark:border-base-content/10 w-full flex flex-col justify-start p-4 lg:p-6 lg:min-h-55">
          {/* title */}
          <div className="w-full flex flex-row justify-start items-center">
            <h2 className="text-base-content text-sm font-semibold">
              Informasi Barang Masuk
            </h2>
          </div>

          {isLoadingBarangMasukDetail ? (
            <>
              <div className="w-full h-8 skeleton mt-4" />
              <div className="w-full h-8 skeleton mt-2" />
            </>
          ) : (
            <>
              {/* tanggal barang masuk */}
              <div className="w-full flex flex-row justify-between items-start gap-3 mt-8">
                {/* icon */}
                <div className="h-full flex flex-row justify-start items-start">
                  <CalendarDays className="size-5 text-emerald-600" />
                </div>

                {/* label and value */}
                <div
                  className={cn(
                    "w-full flex flex-row justify-between pb-3 border-b border-base-content/10 items-center",
                  )}
                >
                  {/* label */}
                  <span className="text-xs lg:text-sm text-base-content/90 font-medium">
                    Tanggal Barang Masuk
                  </span>

                  <span className={"text-[0.625rem] lg:text-sm font-medium"}>
                    {formatTanggalLengkap(
                      dataBarangMasukDetail?.data?.tanggalMasuk ?? new Date(),
                    )}
                  </span>
                </div>
              </div>

              {/* keterangan barang masuk */}
              <div className="w-full flex flex-row justify-between items-start gap-3 mt-4">
                {/* icon */}
                <div className="h-full flex flex-row justify-start items-start">
                  <TextAlignStart className="size-5 text-info" />
                </div>

                {/* label and value */}
                <div
                  className={cn(
                    "w-full flex flex-col justify-between pb-3 border-b border-base-content/10 items-start",
                  )}
                >
                  {/* label */}
                  <span className="text-xs lg:text-sm text-base-content/90 font-medium">
                    Keterangan
                  </span>

                  {/* keterangan */}
                  <div className="mt-2">
                    {dataBarangMasukDetail?.data?.keterangan ? (
                      <span className="text-xs text-base-content font-medium leading-5">
                        {dataBarangMasukDetail?.data?.keterangan}
                      </span>
                    ) : (
                      <span className="text-xs text-base-content/50 italic">
                        Tidak ada keterangan
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* informasi ringkasan */}
        <div className="card bg-base-100 shadow-xs dark:border dark:border-base-content/10 w-full flex flex-col justify-start p-4 lg:p-6 lg:min-h-55">
          {/* title */}
          <div className="w-full flex flex-row justify-start items-center">
            <h2 className="text-base-content text-sm font-semibold">
              Ringkasan
            </h2>
          </div>

          {isLoadingBarangMasukDetail ? (
            <>
              <div className="w-full h-8 skeleton mt-4" />
              <div className="w-full h-8 skeleton mt-2" />
            </>
          ) : (
            <>
              {/* tanggal barang masuk */}
              <div className="w-full flex flex-row justify-between items-start gap-3 mt-8">
                {/* icon */}
                <div className="h-full flex flex-row justify-start items-start">
                  <Package className="size-5 text-emerald-600" />
                </div>

                {/* label and value */}
                <div
                  className={cn(
                    "w-full flex flex-row justify-between pb-3 border-b border-base-content/10 items-center",
                  )}
                >
                  {/* label */}
                  <span className="text-xs lg:text-sm text-base-content font-medium">
                    Total Barang Masuk
                  </span>

                  <span className={"text-sm font-medium"}>
                    {dataBarangMasukDetail?.data?.detailBarangMasuks.length}
                  </span>
                </div>
              </div>

              {/* keterangan barang masuk */}
              <div className="w-full flex flex-row justify-between items-start gap-3 mt-4">
                {/* icon */}
                <div className="h-full flex flex-row justify-start items-start">
                  <BanknoteArrowDown className="size-5 text-info" />
                </div>

                {/* label and value */}
                <div
                  className={cn(
                    "w-full flex flex-col justify-between pb-3 border-b border-base-content/10 items-start",
                  )}
                >
                  {/* label */}
                  <span className="text-xs lg:text-sm text-base-content/90 font-medium">
                    Total Nilai
                  </span>

                  {/* keterangan */}
                  <div className="mt-2">
                    <span className="text-lg text-base-content font-semibold">
                      {formatRupiah(
                        dataBarangMasukDetail?.data?.totalNilai ?? 0,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* daftar produk masuk */}
      <div className="w-full flex flex-col justify-start items-center gap-2 mt-4 lg:mt-0">
        {/* header for sm */}
        <div className="w-full lg:hidden flex flex-row justify-between items-center">
          <div className="flex flex-col justify-start items-start gap-1.5">
            <p className="text-sm font-semibold">Daftar Barang Masuk</p>
            <p className="text-xs px-3 py-1 rounded-full bg-gray-300">
              {dataBarangMasukDetail?.data?.detailBarangMasuks.length} barang
            </p>
          </div>

          {/* button add */}
          <ButtonWithIcon handleBtn={() => {}} />
        </div>

        {/* form for lg */}
        <div className="hidden lg:flex flex-col justify-start items-start min-h-30 w-full card shadow-xs dark:border dark:border-base-content/10 bg-base-100 p-6">
          {/* title */}
          <div className="w-full flex flex-row justify-start items-center">
            <h2 className="text-base-content text-sm font-semibold">
              Tambah Barang Masuk
            </h2>
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-row justify-start items-start mt-4 gap-8"
          >
            {/* produk */}
            <div
              ref={wrapperRef}
              className="flex-2 flex flex-col justify-start items-start gap-2"
            >
              <div className="w-full flex flex-col justify-start items-start gap-2 relative">
                {/* label */}
                <div className="relative">
                  <label className="capitalize text-xs lg:text-sm text-base-content">
                    Cari Produk
                  </label>

                  <span className="absolute -top-1 ml-1 text-error">{"*"}</span>
                </div>
                <InputSearch
                  handleSearch={handleSearch}
                  placeholder="Cari produk berdasarkan nama atau kode"
                  handleOnFocus={() => handleShowActiveComponentChooseProduk()}
                  handleClear={() => handleCloseActiveComponentChooseProduk()}
                />

                {/* modal show data produk for choose */}
                <div
                  className={cn(
                    "absolute bg-base-100 w-full z-40 rounded-lg top-full grid transition-all duration-300 ease-in-out",
                    activeComponentChooseProduk
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      className={cn(
                        "w-full flex flex-col h-60 rounded-lg shadow-xs border border-base-content/10 p-4 gap-2",
                      )}
                    >
                      {isLoadingProdukForChoose ? (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                          <div className="loading loading-xl" />
                        </div>
                      ) : dataProdukForChoose?.data &&
                        dataProdukForChoose?.data?.length > 0 ? (
                        dataProdukForChoose?.data?.map((item, _) => (
                          <button
                            type="button"
                            key={item.id}
                            className="w-full flex flex-row justify-start items-start gap-4 hover:bg-custom-primary/50 p-2 rounded-md transition-all duration-100 ease-in-out"
                            onClick={() => handleSetValueProdukId(item.id)}
                          >
                            {/* img */}
                            <div className="w-11 h-11 rounded-md overflow-hidden">
                              <img
                                src={item.img}
                                alt="foto produk"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* nama */}
                            <div className="flex flex-col justify-start items-start gap-1">
                              <p className="text-sm font-semibold">
                                {item.nama}
                              </p>
                              <p className="text-xs text-base-content/50 font-semibold">
                                {item.kode}
                              </p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                          <p className="text-sm font-medium text-base-content/50">
                            Data produk tidak ditemukan
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* card produk choose */}
              {produkChoose && (
                <div className="w-full flex flex-col justify-start items-start gap-2 mt-4">
                  <p className="text-xs font-medium">Daftar Pilihan Barang:</p>
                  {produkChoose.map((item) => (
                    <div
                      key={item.id}
                      className="w-full flex flex-row justify-start items-start gap-4 hover:bg-custom-primary/50 p-2 rounded-md transition-all duration-100 ease-in-out"
                    >
                      {/* img */}
                      <div className="w-11 h-11 rounded-md overflow-hidden">
                        <img
                          src={item.img}
                          alt="foto produk"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* nama */}
                      <div className="flex flex-col justify-start items-start gap-1">
                        <p className="text-sm font-semibold">{item.nama}</p>
                        <p className="text-xs text-base-content/50 font-semibold">
                          {item.kode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* input jumlah perbox */}
            <div className="flex-2 flex flex-row justify-start items-center">
              <InputNumber
                register={register("jumlahBox", {
                  valueAsNumber: true,
                })}
                label="Jumlah Box"
                name="jumlahBox"
                placeholder="Masukan Jumlah Box"
                errorMessage={errors?.jumlahBox?.message}
                required
              />
            </div>

            {/* button submit */}
            <div className="flex-1 flex flex-row justify-end items-end h-18">
              <ButtonSubmitWithIcon
                label="Tambah Barang Masuk"
                isLoading={isPendingBarangMasukDetail}
              />
            </div>
          </form>
        </div>

        {/* show data */}
        <ShowDataBarangMasuk
          dataBarangMasukDetail={dataBarangMasukDetail}
          isLoadingBarangMasukDetail={isLoadingBarangMasukDetail}
        />
      </div>
    </div>
  );
};

export default BarangMasukDetail;
