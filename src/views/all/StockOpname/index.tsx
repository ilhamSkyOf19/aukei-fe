import ButtonCluster from "../../../components/ui/button/ButtonCluster";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_STOCK_OPNAME } from "../../../types/toast.type";
import useStockOpname from "./useStockOpname";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import { PackagePlus } from "lucide-react";
import InputSearch from "../../../components/inputs/InputSearch";
import RangeDate from "../../../components/filters/RangeDate";
import FilterSort from "../../../components/filters/Sort";
import type { FC } from "react";
import StockOpnameOwner from "./StockOpnameOwner";
import StockOpnameKasir from "./StockOpnameKasir";
import ModalFormulirStockOpname from "../../../components/modals/ModalFormulirStockOpname";

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
    handleSetToast,
    handleShowModalFormulirStockOpname,
    modalFormulirStockOpnameRef,
    handleRedirectDetail,
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
        <div className="w-full flex flex-row justify-center fixed md:sticky p-2 top-14 z-8 backdrop-blur-2xl shrink-0">
          <div className="w-full flex flex-row justify-start items-center bg-base-100 shadow-sm h-16 md:h-14 p-2 gap-2 dark:border dark:border-base-content/10 rounded-2xl md:rounded-xl overflow-x-auto">
            {/* produk */}
            <ButtonCluster
              isActive={activeCluster === "stockOpname"}
              label="Stok Opname"
              handleActive={() => handleActiveCluster("stockOpname")}
              customWidth="flex-1"
            />

            {/* kategori */}
            <ButtonCluster
              isActive={activeCluster === "pengajuanStockOpname"}
              label="Pengajuan Stok Opname"
              handleActive={() => handleActiveCluster("pengajuanStockOpname")}
              customWidth="flex-1"
            />
          </div>
        </div>

        {/* content */}
        <div className="w-full flex flex-col justify-center items-start px-2.5 mt-1 pt-20 md:pt-0 md:mt-0">
          {/* filter */}
          <div className="w-full bg-base-100 p-2.5 border border-transparent dark:border-base-content/10 flex flex-col md:flex-row justify-start items-start md:items-start rounded-2xl md:rounded-xl shadow-sm">
            {/* button add barang masuk */}
            <ButtonWithIcon
              icon={PackagePlus}
              label="Tambah Barang Masuk"
              handleBtn={() => () => {}}
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
            </div>
          </div>

          {activeCluster === "stockOpname" && (
            <StockOpnameOwner
              data={dataStockOpname?.data?.data}
              isLoading={isLoadingStockOpname}
              handleRedirectDetail={handleRedirectDetail}
            />
          )}

          {activeCluster === "pengajuanStockOpname" && (
            <StockOpnameKasir
              data={dataStockOpname?.data?.data}
              isLoading={isLoadingStockOpname}
            />
          )}
        </div>
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
