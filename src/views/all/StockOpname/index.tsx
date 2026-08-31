import ButtonCluster from "../../../components/ui/button/ButtonCluster";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_STOCK_OPNAME } from "../../../types/toast.type";
import useStockOpname from "./useStockOpname";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import { BanknoteArrowDown, BanknoteArrowUp, PackagePlus } from "lucide-react";
import InputSearch from "../../../components/inputs/InputSearch";
import RangeDate from "../../../components/filters/RangeDate";
import FilterSort from "../../../components/filters/Sort";
import type { FC } from "react";
import ModalFormulirStockOpname from "../../../components/modals/ModalFormulirStockOpname";
import { cn } from "../../../utils/cn";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import StockOpnamePengajuan from "./StockOpnamePengajuan";
import StockOpnameRegular from "./StockOpnameOwnerRegular";
import CardStatistik from "../../../components/ui/cards/CardStatistik";
import { formatNumber } from "../../../helpers/helpers";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";

type Props = {
  fromPengajuan?: boolean;
};
const StockOpname: FC<Props> = ({ fromPengajuan }) => {
  // call use
  const {
    handleActiveCluster,
    activeCluster,
    toast,
    windowSize,
    dataStockOpname,
    handleLimit,
    handlePage,
    handleSearch,
    isLoadingStockOpname,
    handleSort,
    sort,
    handleCloseModalFormulirStockOpname,
    handleShowModalFormulirStockOpname,
    modalFormulirStockOpnameRef,
    handleRedirectDetail,
    pengguna,
    dataPengajuanStockOpname,
  } = useStockOpname({ fromPengajuan });

  return (
    <div className="w-full">
      {/* toast */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_STOCK_OPNAME[toast.type].message}
          color={TOAST_CONFIG_STOCK_OPNAME[toast.type].color}
        />
      )}

      <div className="w-full mb-2.5 flex flex-col justify-start items-start">
        {/* button cluster */}
        <div
          className={cn(
            "w-full flex flex-row justify-center fixed md:sticky p-2 z-8 backdrop-blur-2xl shrink-0",
            pengguna?.role === ROLE_INTERNAL_TYPE.OWNER ? "top-14" : "top-0",
          )}
        >
          {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
            <div className="w-full flex flex-row justify-start items-center bg-base-100 shadow-sm h-16 md:h-14 p-2 gap-2 dark:border dark:border-base-content/10 rounded-2xl md:rounded-xl overflow-x-auto">
              {/* stock opname */}
              <ButtonCluster
                isActive={activeCluster === "stockOpname"}
                label="Stok Opname"
                handleActive={() => handleActiveCluster("stockOpname")}
                customWidth="flex-1"
              />

              {/* pengajuan stock opname */}
              <ButtonCluster
                isActive={activeCluster === "pengajuanStockOpname"}
                label="Pengajuan Stok Opname"
                handleActive={() => handleActiveCluster("pengajuanStockOpname")}
                customWidth="flex-1"
              />
            </div>
          )}
        </div>
        {/* statistik */}
        <div
          className={cn(
            "w-full px-2.5 pb-2.5",
            pengguna?.role === ROLE_INTERNAL_TYPE.KASIR && "mt-2.5",
          )}
        >
          <div className="bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 gap-4 flex flex-col justify-start items-start">
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
              <CardStatistik
                isLoading={isLoadingStockOpname}
                icon={{
                  icon: BanknoteArrowDown,
                  bgColor: "bg-rose-100",
                  iconColor: "text-rose-400",
                }}
                label={"Total Kerugian kotor"}
                value={
                  formatNumber(
                    dataStockOpname?.data?.statistik
                      ?.totalKerugianStockOpname ?? 0,
                  ) || "0"
                }
                caption={"Jumlah kerugian kotor"}
              />
              <CardStatistik
                isLoading={isLoadingStockOpname}
                icon={{
                  icon: BanknoteArrowUp,
                  bgColor: "bg-emerald-100",
                  iconColor: "text-emerald-400",
                }}
                label={"Total Surplus"}
                value={
                  formatNumber(
                    dataStockOpname?.data?.statistik
                      ?.totalNilaiSurplusStockOpname ?? 0,
                  ) || "0"
                }
                caption={"Jumlah surplus"}
              />
              <CardStatistik
                isLoading={isLoadingStockOpname}
                icon={{
                  icon: BanknoteArrowDown,
                  bgColor: "bg-rose-100",
                  iconColor: "text-rose-400",
                }}
                label={"Total Kerugian Bersih"}
                value={
                  formatNumber(
                    dataStockOpname?.data?.statistik
                      ?.kerugianStockOpnameBersih ?? 0,
                  ) || "0"
                }
                caption={"Jumlah kerugian bersih"}
              />
              <CardStatistik
                isLoading={isLoadingStockOpname}
                icon={{
                  icon: BanknoteArrowUp,
                  bgColor: "bg-emerald-100",
                  iconColor: "text-emerald-400",
                }}
                label={"Total Surplus Bersih"}
                value={
                  formatNumber(
                    dataStockOpname?.data?.statistik?.totalSurplusBersih ?? 0,
                  ) || "0"
                }
                caption={"Jumlah surplus bersih"}
              />
            </div>
          </div>
        </div>
        {/* content */}
        <div
          className={cn(
            "w-full flex flex-col justify-center items-start px-2.5 mt-1 md:pt-0 md:mt-0",
            pengguna?.role === ROLE_INTERNAL_TYPE.OWNER ? " pt-20" : "pt-2.5",
          )}
        >
          {/* filter */}
          <div className="w-full bg-base-100 p-2.5 border border-transparent dark:border-base-content/10 flex flex-col md:flex-row justify-start items-start md:items-start rounded-2xl md:rounded-xl shadow-sm">
            {/* button add barang masuk */}
            <ButtonWithIcon
              icon={PackagePlus}
              label="Tambah Stock Opname"
              handleBtn={() => handleShowModalFormulirStockOpname()}
              customWidth="md:hidden w-full mb-3"
            />

            <div className="w-full md:flex-1 flex flex-row justify-start items-center">
              {/* input search */}
              <InputSearch
                handleSearch={handleSearch}
                placeholder="Cari berdasarkan kode"
                withLabel
              />
            </div>

            <div className="w-full md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-start gap-2.5 mt-3 md:mt-0">
              {/* input range date */}
              <RangeDate customWidth="flex-2 md:flex-none md:w-50 lg:w-70" />
              {/* filter sort */}
              <FilterSort
                setSort={handleSort}
                customWidth="flex-1 md:flex-none md:w-30 lg:w-40"
                value={sort}
              />

              {activeCluster === "stockOpname" &&
                pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
                  <>
                    {/* button add stock opname */}
                    <div className="flex-col justify-start items-start gap-1.5 hidden md:flex">
                      <span className="text-xs text-base-content/80 font-medium">
                        Aksi
                      </span>

                      <ButtonWithIcon
                        icon={PackagePlus}
                        label="Tambah Stok Opname"
                        handleBtn={() => handleShowModalFormulirStockOpname()}
                        customWidth="hidden md:flex"
                        noLabel={windowSize === "md" && true}
                        {...(windowSize === "md" && { customSize: "lg" })}
                      />
                    </div>
                  </>
                )}

              {activeCluster === "pengajuanStockOpname" &&
                pengguna?.role === ROLE_INTERNAL_TYPE.KASIR && (
                  <>
                    {/* button add stock opname */}
                    <div className="flex-col justify-start items-start gap-1.5 hidden md:flex">
                      <span className="text-xs text-base-content/80 font-medium">
                        Aksi
                      </span>

                      <ButtonWithIcon
                        icon={PackagePlus}
                        label="Tambah Stok Opname"
                        handleBtn={() => handleShowModalFormulirStockOpname()}
                        customWidth="hidden md:flex"
                        noLabel={windowSize === "md" && true}
                        {...(windowSize === "md" && { customSize: "lg" })}
                      />
                    </div>
                  </>
                )}
            </div>
          </div>

          {((activeCluster === "stockOpname" &&
            pengguna?.role === ROLE_INTERNAL_TYPE.OWNER) ||
            (activeCluster === "pengajuanStockOpname" &&
              pengguna?.role === ROLE_INTERNAL_TYPE.KASIR)) && (
            <StockOpnameRegular
              data={dataStockOpname?.data?.data}
              isLoading={isLoadingStockOpname}
              handleRedirectDetail={handleRedirectDetail}
            />
          )}

          {activeCluster === "pengajuanStockOpname" &&
            pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
              <StockOpnamePengajuan
                data={dataPengajuanStockOpname?.data?.data}
                isLoading={isLoadingStockOpname}
                handleRedirectDetail={handleRedirectDetail}
              />
            )}
        </div>

        {/* pagination and limits */}
        <PaginationAndLimit
          currentPage={
            dataStockOpname?.data?.meta.currentPage ||
            dataPengajuanStockOpname?.data?.meta.currentPage ||
            null
          }
          totalPage={
            dataStockOpname?.data?.meta.totalPage ||
            dataPengajuanStockOpname?.data?.meta.totalPage ||
            null
          }
          setPage={handlePage}
          setLimit={handleLimit}
          emptyData={
            !dataStockOpname?.data?.data?.length &&
            !dataPengajuanStockOpname?.data?.data?.length
          }
        />
      </div>

      {/* modal tambah stock opname */}
      <ModalFormulirStockOpname
        modalRef={modalFormulirStockOpnameRef}
        handleCloseModal={handleCloseModalFormulirStockOpname}
      />
    </div>
  );
};

export default StockOpname;
