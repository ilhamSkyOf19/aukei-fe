import { type FC } from "react";
import { ArrowRight, Bell, BellOff, RefreshCw } from "lucide-react";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import { cn } from "../../../../utils/cn";
import useNotifikasi from "./useNotifikasi";
import CardNotifikasiTempo from "../../cards/CardNotifikasiTempo";
import CardNotifikasiPengajuanBarang from "../../cards/CardNotifikasiPengajuanBarang";
import CardNotifikasiProduk from "../../cards/CardNotifikasiProduk";
import DataEmpty from "../../../messages/DataEmpty";
import CardNotifikasiPengajuanReturBarang from "../../cards/CardNotifikasiPengajuanReturBarang";

const chooseList: { label: string; value: string }[] = [
  {
    label: "Semua",
    value: "semua",
  },
  {
    label: "Produk",
    value: "produk",
  },
  {
    label: "Jatuh Tempo",
    value: "tempo",
  },
  {
    label: "Pengajuan Barang",
    value: "pengajuan",
  },
  {
    label: "Pengajuan Retur Barang",
    value: "pengajuanReturBarang",
  },
];

type Props = {
  pengguna?: PayloadPenggunaInternalType | null;
};
const Notifikasi: FC<Props> = ({ pengguna }) => {
  const {
    handleSetIsChoose,
    isChoose,
    dataNotifikasiGlobalProduk,
    isLoadingNotifikasiGlobal,
    handleRefresh,
    isLoadingRefresh,
    disabledRefresh,
    handleRedirectProdukDetail,
    isExistingNotifikasiGlobal,
    dataNotifikasiGlobalTempoOverdue,
    isLoadingDataNotifikasiProduk,
    isLoadingDataNotifikasiTempo,
    dataNotifikasiProduk,
    dataNotifikasiTempo,
    handleIsOpen,
    buttonDropdownRef,
    isOpen,
    ulRef,
    handleRedirectTempoDetail,
    countNotifikasiGlobal,

    dataNotifikasiPengajuanBarang,
    isLoadingDataNotifikasiPengajuanBarang,
    dataNotifikasiGlobalPengajuanBarang,
    handleRedirectPengajuanBarangDetail,
    handleRedirectDetail,
    dataNotifikasiPengajuanReturBarang,
    dataNotifikasiGlobalPengajuanReturBarang,
    isLoadingDataNotifikasiPengajuanReturBarang,
    handleRedirectPengajuanReturBarangDetail,
  } = useNotifikasi({ pengguna });

  return (
    <div
      className={cn(
        "dropdown dropdown-end",
        isOpen ? "dropdown-open" : "dropdown-close",
      )}
    >
      <button
        ref={buttonDropdownRef}
        type="button"
        role="button"
        className="cursor-pointer p-2 focus:bg-custom-primary/50 hover:bg-custom-primary/50 rounded-full transition-all duration-150 ease-in-out relative"
        onClick={() => {
          handleIsOpen((prev) => !prev);
        }}
      >
        <Bell className="size-5 text-base-content" />

        {/* count */}
        {countNotifikasiGlobal && (
          <p
            className={cn(
              "absolute text-[0.625rem] top-0 bg-error px-1 h-4 flex flex-col justify-center items-center rounded-full text-primary-white",
              countNotifikasiGlobal > 20 ? "-right-2.5" : "right-0",
            )}
          >
            {countNotifikasiGlobal > 20 ? "20+" : countNotifikasiGlobal}
          </p>
        )}
      </button>
      <ul
        ref={ulRef}
        className="dropdown-content overflow-hidden menu bg-base-100 rounded-box w-80 border border-base-content/10 md:w-130 shadow-2xl rounded-2xl md:rounded-xl mt-1.5"
      >
        <li>
          <div className="w-full flex flex-row justify-between items-center hover:bg-transparent active:bg-transparent cursor-default h-full overflow-y-auto scrollbar-thumb-custom-secondary">
            {/* title */}
            <p className="text-xs font-semibold text-base-content">
              Notifikasi
            </p>

            {/* action refresh */}
            <button
              type="button"
              className={cn(
                "w-12 cursor-pointer flex flex-col justify-center gap-1 items-center absolute disabled:opacity-50 top-1 right-0",
                !isLoadingNotifikasiGlobal && "p-1",
              )}
              disabled={
                isLoadingNotifikasiGlobal ||
                isLoadingRefresh ||
                disabledRefresh ||
                isLoadingDataNotifikasiProduk ||
                isLoadingDataNotifikasiTempo ||
                isLoadingDataNotifikasiPengajuanBarang ||
                isLoadingDataNotifikasiPengajuanReturBarang
              }
              onClick={() => handleRefresh()}
            >
              {isLoadingRefresh ? (
                <>
                  <RefreshCw className="size-5 animate-spin text-base-content" />

                  <span className="text-[0.625rem] hidden md:flex skeleton skeleton-text">
                    Refresh
                  </span>
                </>
              ) : (
                <RefreshCw className="size-5 text-base-content" />
              )}
            </button>
          </div>
        </li>

        {/* choose */}
        <li className="mb-4 w-full mt-2">
          <div className="w-full flex scrollbar-thin scrollbar-thumb-custom-secondary flex-row py-2.5 gap-2.5 justify-start overflow-x-auto items-start hover:bg-transparent active:bg-transparent cursor-default">
            {chooseList.map((item, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "px-2.5 py-1.5 rounded-full text-base-content text-[0.7rem] border border-transparent transition-all duration-100 ease-in-out shrink-0",
                  isChoose === item.value
                    ? "bg-custom-secondary text-primary-white border "
                    : "bg-base-300 hover:border-custom-secondary ",
                )}
                onClick={() => handleSetIsChoose(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </li>

        <li className="w-full h-100">
          {isLoadingNotifikasiGlobal ||
          isLoadingDataNotifikasiProduk ||
          isLoadingDataNotifikasiTempo ||
          isLoadingDataNotifikasiPengajuanBarang ? (
            <div className="w-full h-full hover:bg-transparent active:bg-transparent cursor-default overflow-y-auto flex flex-col justify-start items-start gap-2.5">
              <div className="w-full h-14 skeleton rounded-2xl md:rounded-xl" />
              <div className="w-full h-14 skeleton rounded-2xl md:rounded-xl" />
              <div className="w-full h-14 skeleton rounded-2xl md:rounded-xl" />
              <div className="w-full h-14 skeleton rounded-2xl md:rounded-xl" />
              <div className="w-full h-14 skeleton rounded-2xl md:rounded-xl" />
            </div>
          ) : (
            <div className="w-full h-full hover:bg-transparent active:bg-transparent cursor-default overflow-y-auto flex flex-col justify-start items-start gap-2.5 scrollbar-thin">
              {isChoose === "semua" &&
                (isExistingNotifikasiGlobal ? (
                  <>
                    {/* data produk */}
                    {dataNotifikasiGlobalProduk?.map((data, _) => (
                      <CardNotifikasiProduk
                        key={data.id}
                        data={data}
                        handleRedirectProdukDetail={handleRedirectProdukDetail}
                        pengguna={pengguna}
                      />
                    ))}

                    {/* data tempo */}
                    {dataNotifikasiGlobalTempoOverdue?.map((data, index) => (
                      <CardNotifikasiTempo
                        key={index}
                        data={data}
                        handleRedirectTempoDetail={handleRedirectTempoDetail}
                      />
                    ))}

                    {/* data pengajuan barang */}
                    {dataNotifikasiGlobalPengajuanBarang?.map((data, index) => (
                      <CardNotifikasiPengajuanBarang
                        key={index}
                        data={data}
                        handleRedirectPengajuanBarangDetail={
                          handleRedirectPengajuanBarangDetail
                        }
                      />
                    ))}

                    {/* data pengajuan reur barang */}
                    {dataNotifikasiGlobalPengajuanReturBarang?.map(
                      (data, index) => (
                        <CardNotifikasiPengajuanReturBarang
                          key={index}
                          data={data}
                          handleRedirectPengajuanReturBarangDetail={
                            handleRedirectPengajuanReturBarangDetail
                          }
                        />
                      ),
                    )}
                  </>
                ) : (
                  <div className="pointer-events-none w-full h-full flex flex-col justify-center items-center">
                    <DataEmpty
                      iconData={BellOff}
                      title="Tidak Ada Notifikasi"
                      description="Belum ada data notifikasi yang dapat ditampilkan saat ini"
                      xs
                    />
                  </div>
                ))}

              {/* data notifikasi produk */}
              {isChoose === "produk" &&
                (dataNotifikasiProduk &&
                dataNotifikasiProduk.data &&
                dataNotifikasiProduk.data?.data.length > 0 ? (
                  dataNotifikasiProduk.data.data.map((item) => (
                    <CardNotifikasiProduk
                      key={item.id}
                      pengguna={pengguna}
                      data={item}
                      handleRedirectProdukDetail={handleRedirectProdukDetail}
                    />
                  ))
                ) : (
                  <div className="pointer-events-none w-full h-full flex flex-col justify-center items-center">
                    <DataEmpty
                      iconData={BellOff}
                      title="Tidak Ada Notifikasi Produk"
                      description="Belum ada data notifikasi produk yang dapat ditampilkan saat ini"
                      xs
                    />
                  </div>
                ))}

              {/* data notifikasi tempo */}
              {isChoose === "tempo" &&
                (dataNotifikasiTempo &&
                dataNotifikasiTempo.data &&
                dataNotifikasiTempo.data?.data.length > 0 ? (
                  dataNotifikasiTempo.data.data.map((item, index) => (
                    <CardNotifikasiTempo
                      key={index}
                      data={item}
                      handleRedirectTempoDetail={handleRedirectTempoDetail}
                    />
                  ))
                ) : (
                  <div className="pointer-events-none w-full h-full flex flex-col justify-center items-center">
                    <DataEmpty
                      iconData={BellOff}
                      title="Tidak Ada Notifikasi Jatuh Tempo"
                      description="Belum ada data notifikasi jatuh tempo yang dapat ditampilkan saat ini"
                      xs
                    />
                  </div>
                ))}

              {/* data notifikasi pengajuan barang */}
              {isChoose === "pengajuan" &&
                (dataNotifikasiPengajuanBarang &&
                dataNotifikasiPengajuanBarang.data &&
                dataNotifikasiPengajuanBarang.data?.data?.length > 0 ? (
                  dataNotifikasiPengajuanBarang.data.data.map((item, index) => (
                    <CardNotifikasiPengajuanBarang
                      key={index}
                      data={item}
                      handleRedirectPengajuanBarangDetail={
                        handleRedirectPengajuanBarangDetail
                      }
                    />
                  ))
                ) : (
                  <div className="pointer-events-none w-full h-full flex flex-col justify-center items-center">
                    <DataEmpty
                      iconData={BellOff}
                      title="Tidak Ada Notifikasi Pengajuan Barang"
                      description="Belum ada data notifikasi pengajuan barang yang dapat ditampilkan saat ini"
                      xs
                    />
                  </div>
                ))}

              {/* data notifikasi pengajuan retur barang */}
              {isChoose === "pengajuanReturBarang" &&
                (dataNotifikasiPengajuanReturBarang &&
                dataNotifikasiPengajuanReturBarang.data &&
                dataNotifikasiPengajuanReturBarang.data?.length > 0 ? (
                  dataNotifikasiPengajuanReturBarang.data.map((item, index) => (
                    <CardNotifikasiPengajuanReturBarang
                      key={index}
                      data={item}
                      handleRedirectPengajuanReturBarangDetail={
                        handleRedirectPengajuanReturBarangDetail
                      }
                    />
                  ))
                ) : (
                  <div className="pointer-events-none w-full h-full flex flex-col justify-center items-center">
                    <DataEmpty
                      iconData={BellOff}
                      title="Tidak Ada Notifikasi Pengajuan Barang"
                      description="Belum ada data notifikasi pengajuan barang yang dapat ditampilkan saat ini"
                      xs
                    />
                  </div>
                ))}
            </div>
          )}
        </li>

        {/* button detail */}
        {isChoose !== "semua" && (
          <li>
            <div className="w-full flex flex-row cursor-default justify-end items-end hover:bg-transparent active:bg-transparent border-t border-base-content/30 rounded-none">
              <button
                type="button"
                className="flex flex-row justify-start items-center gap-2.5 hover:underline"
                onClick={handleRedirectDetail}
              >
                <span className="text-[0.7rem] text-info">Lihat Semua</span>
                <ArrowRight className="size-4 text-info" />
              </button>
            </div>
          </li>
        )}
      </ul>
      {/* <div className="pointer-events-none w-full h-full flex flex-col justify-center items-center">
                <DataEmpty
                  iconData={LucideBellOff}
                  title="Tidak Ada Notifikasi"
                  description="Belum ada data notifikasi yang dapat ditampilkan saat ini"
                  xs
                />
              </div> */}
    </div>
  );
};

export default Notifikasi;
