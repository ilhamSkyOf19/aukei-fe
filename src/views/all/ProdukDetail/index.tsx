import {
  ArrowLeft,
  Box,
  CalendarDays,
  CircleCheck,
  Clock,
  PencilLineIcon,
  TriangleAlert,
} from "lucide-react";
import ButtonActionWithIcon from "../../../components/ui/button/ButtonActionWithIcon";
import useProdukDetail from "./useProdukDetail";
import { formatRupiah, generateColorForStok } from "../../../helpers/helpers";
import { cn } from "../../../utils/cn";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";

const ProdukDetail = () => {
  // call use
  const {
    handleRedirectDetail,
    isExistData,
    isLoadingDataProduk,
    dataProduk,
    handleRedirectBack,
  } = useProdukDetail();

  return (
    <div className="w-full mb-30 flex flex-col justify-start items-start px-2 lg:px-4">
      {/* Cluster inventori */}
      <div className="card w-full bg-base-100 flex flex-col justify-start items-start p-4 mt-4">
        {/* header */}
        <div className="w-full flex flex-row justify-center items-center gap-2">
          {/* button back */}
          <div className="flex flex-1 flex-row justify-start items-center">
            <ButtonBackText />
          </div>

          <div className="flex flex-1 flex-row justify-center items-center">
            {/* title */}
            <h2 className="text-sm lg:text-base font-semibold text-base-content">
              Data Produk
            </h2>
          </div>

          {/* aksi */}
          <div className="flex flex-1 flex-row justify-end items-center">
            {/* button update */}
            <ButtonActionWithIcon
              icon={PencilLineIcon}
              label="Ubah"
              handleClick={() => handleRedirectDetail()}
              buttonColor="btn-info"
              textColor="text-primary-white"
              iconColor="text-primary-white"
            />
          </div>
        </div>

        <div className="w-full flex lg:flex-row flex-col justify-start items-center gap-0 lg:gap-4">
          {/* img */}
          <div className="w-full order-1 lg:order-2 flex-2 flex flex-row justify-center items-center">
            <div
              className={cn(
                "w-[95%] h-60 lg:max-h-120 rounded-md mt-8",
                isLoadingDataProduk && "skeleton",
              )}
            >
              {!isLoadingDataProduk && isExistData && (
                <img
                  src={dataProduk?.data?.img}
                  alt="gambar produk"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          {/* content two */}
          <div className="w-full lg:flex-3 order-2 lg:order-1 flex flex-col justify-start items-start gap-4 mt-8">
            {/* nama */}
            {isLoadingDataProduk ? (
              <div className="w-40 h-7.5 skeleton" />
            ) : (
              isExistData && (
                <h3 className="text-xl lg:text-2xl text-base-content font-semibold">
                  {dataProduk?.data?.nama}
                </h3>
              )
            )}

            {/* kode produk */}
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              {isLoadingDataProduk ? (
                <div className="w-40 h-7.5 skeleton" />
              ) : (
                <>
                  {/* sm */}
                  <div className="flex flex-col justify-start items-start lg:hidden gap-1.5">
                    {/* label */}
                    <span className="text-xs font-medium text-base-content/60">
                      Kode Produk
                    </span>

                    {/* value */}
                    <span className="text-sm font-medium text-base-content">
                      {dataProduk?.data?.kode}
                    </span>
                  </div>

                  {/* lg */}
                  <div className="w-full hidden flex-row gap-3 justify-start items-start lg:flex">
                    {/* label */}
                    <div className="flex-1 flex flex-row justify-between items-center">
                      <span className="text-sm font-medium text-base-content/60">
                        Kode Produk
                      </span>
                      <span className="text-sm font-medium text-base-content/60">
                        :
                      </span>
                    </div>

                    {/* value */}
                    <div className="flex-4 flex flex-row justify-start items-center">
                      <span className="text-sm font-medium text-base-content">
                        {dataProduk?.data?.kode}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* kategori produk */}
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              {isLoadingDataProduk ? (
                <div className="w-40 h-7.5 skeleton" />
              ) : (
                isExistData && (
                  <>
                    {/* sm */}
                    <div className="flex flex-col justify-start items-start lg:hidden gap-1.5">
                      {/* label */}
                      <span className="text-xs font-medium text-base-content/60">
                        Kategori
                      </span>

                      {/* value */}
                      <span className="text-sm font-medium  text-base-content">
                        {dataProduk?.data?.kategori.nama}
                      </span>
                    </div>

                    {/* lg */}
                    <div className="w-full hidden flex-row gap-3 justify-start items-start lg:flex">
                      {/* label */}
                      <div className="flex-1 flex flex-row justify-between items-center">
                        <span className="text-sm font-medium text-base-content/60">
                          Kategori
                        </span>
                        <span className="text-sm font-medium text-base-content/60">
                          :
                        </span>
                      </div>

                      {/* value */}
                      <div className="flex-4 flex flex-row justify-start items-center">
                        <span className="text-sm font-medium text-base-content">
                          {dataProduk?.data?.kategori?.nama}
                        </span>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>

            {/* line */}
            <div className="w-full h-px rounded-full bg-base-content/20 my-1" />

            {/* content harga  */}
            <div className="w-full flex flex-row justify-between gap-2 items-center">
              {isLoadingDataProduk ? (
                <>
                  <div className="flex-1 h-20 skeleton" />
                  <div className="flex-1 h-20 skeleton" />
                </>
              ) : (
                isExistData && (
                  <>
                    {/* harga jual */}
                    <div className="flex-1 h-20 rounded-md bg-emerald-100 py-2 px-4 gap-2 flex flex-col justify-start items-start">
                      {/* label */}
                      <span className="text-xs text-base-content">
                        Harga Jual
                      </span>

                      {/* harga */}
                      <span className="text-lg font-semibold text-emerald-600">
                        {formatRupiah(dataProduk?.data?.hargaJual ?? 0)}
                      </span>
                    </div>
                    {/* harga beli */}
                    <div className="flex-1 h-20 rounded-md bg-indigo-100 py-2 px-4 gap-2 flex flex-col justify-start items-start">
                      {/* label */}
                      <span className="text-xs text-base-content">
                        Harga Jual
                      </span>

                      {/* harga */}
                      <span className="text-lg font-semibold text-indigo-600">
                        {formatRupiah(dataProduk?.data?.hargaJual ?? 0)}
                      </span>
                    </div>
                  </>
                )
              )}
            </div>

            {isLoadingDataProduk ? (
              <div className="w-full flex flex-col justify-start items-start gap-5 border border-base-content/10 card px-3 py-4 mt-4">
                {Array.from({ length: 4 }, (_, idx) => (
                  <div key={idx} className="skeleton w-full h-8" />
                ))}
              </div>
            ) : (
              isExistData && (
                <>
                  {/* content stock */}
                  <div className="w-full flex flex-col justify-start items-start gap-5 border border-base-content/10 card px-3 py-4 mt-4">
                    {/* stok saat ini */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <Box className="size-5 text-base-content" />
                      </div>

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs text-base-content/90 text-medium">
                          Stok Saat Ini
                        </span>

                        {/* stok */}
                        <span
                          className={cn(
                            "text-xs lg:text-sm font-medium",
                            generateColorForStok(
                              dataProduk?.data?.stok ?? 0,
                              dataProduk?.data?.stokMinimum ?? 0,
                            ),
                          )}
                        >
                          {dataProduk?.data?.stok}
                        </span>
                      </div>
                    </div>

                    {/* isi per box */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <Box className="size-5 text-warning" />
                      </div>

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs text-base-content/90 text-medium">
                          Isi Per Box
                        </span>

                        {/* stok */}
                        <span
                          className={cn(
                            "text-xs lg:text-sm font-medium text-base-content",
                          )}
                        >
                          {dataProduk?.data?.isiPerBox}
                        </span>
                      </div>
                    </div>

                    {/* stok minimun */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <TriangleAlert className="size-5 text-warning" />
                      </div>

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs text-base-content/90 text-medium">
                          Stok Minimum
                        </span>

                        {/* stok */}
                        <span
                          className={cn(
                            "text-xs lg:text-sm font-medium text-error",
                          )}
                        >
                          {dataProduk?.data?.stokMinimum}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* content status */}
                  <div className="w-full flex flex-col justify-start items-start gap-5 border border-base-content/10 card px-3 py-4 mt-2">
                    {/* is active */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <CircleCheck className="size-5 text-base-content" />
                      </div>

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs text-base-content/90 text-medium">
                          Status Produk
                        </span>

                        {/* stok */}
                        {dataProduk?.data?.isActive === true ? (
                          <div className="flex flex-row justify-center items-center px-2.5 py-0.5 bg-emerald-100 gap-1 rounded-full">
                            {/* label */}
                            <span className="text-[0.7rem] text-emerald-600">
                              Aktif
                            </span>

                            <div
                              aria-label="success"
                              className="status status-success status-sm"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-row justify-center items-center px-2.5 py-0.5 bg-rose-100 gap-1 rounded-full">
                            {/* label */}
                            <span className="text-[0.7rem] text-rose-600">
                              Tidak Aktif
                            </span>

                            <div
                              aria-label="success"
                              className="status status-error status-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* di buat */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <CalendarDays className="size-5 text-emerald-600" />
                      </div>

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs lg:text-sm text-base-content/90 text-medium">
                          Dibuat
                        </span>

                        {/* tanggal */}
                        <span
                          className={cn(
                            "text-[0.7rem] lg:text-sm text-base-content",
                          )}
                        >
                          {formatTanggalPanjang(
                            dataProduk?.data?.createdAt ?? "",
                          )}
                        </span>
                      </div>
                    </div>

                    {/* di ubah */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <Clock className="size-5 text-info" />
                      </div>

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs lg:text-sm text-base-content/90 text-medium">
                          Diubah
                        </span>

                        {/* tanggal */}
                        <span
                          className={cn(
                            "text-[0.7rem] lg:text-sm text-base-content",
                          )}
                        >
                          {formatTanggalPanjang(
                            dataProduk?.data?.updatedAt ?? "",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdukDetail;
