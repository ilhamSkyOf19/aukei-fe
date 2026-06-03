import { type FC } from "react";
import PaginationAndLimit from "../../../../../components/filters/PaginationAndLimit";
import useShowData from "./useShowData";
import InputSearch from "../../../../../components/inputs/InputSearch";
import FilterSort from "../../../../../components/filters/Sort";
import { EllipsisVertical, Tag } from "lucide-react";
import type { ResponseKategoriProdukType } from "../../../../../models/kategoriProduk.model";
import DataEmpty from "../../../../../components/messages/DataEmpty";
import ButtonAdd from "../../../../../components/ui/button/ButtonWithIcon";
import ModalFormulirKategoriProduk from "../../../../../components/modals/ModalFormulirKategoriProduk";
import Toast from "../../../../../components/messages/Toast";
import { TOAST_CONFIG_KATEGORI_PRODUK } from "../../../../../types/toast.type";
import Alert from "../../../../../components/messages/Alert";
import { ALERT_CONFIG_KATEGORI_PRODUK } from "../../../../../types/alert.types";
import ModalDelete from "../../../../../components/modals/ModalDelete";

const ShowData = () => {
  // call use
  const {
    dataKategoriProduk,
    handleLimit,
    handlePage,
    handleSearch,
    handleSort,
    isExistDataKategoriProduk,
    isLoadingKategoriProduk,
    dataKategoriForUpdate,
    handleCloseModalFormulirKategori,
    handleShowModalFormulirKategori,
    modalFormulirKategoriRef,
    toast,
    alert,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
    dataDelete,
  } = useShowData();

  return (
    <div className="card flex-2 bg-base-100 flex flex-col justify-start items-start p-4">
      {/* alert */}
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_KATEGORI_PRODUK[alert.type].message}
        />
      )}

      {/* toast create */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_KATEGORI_PRODUK[toast.type].message}
          color={TOAST_CONFIG_KATEGORI_PRODUK[toast.type].color}
        />
      )}

      {/* filter */}
      <div className="w-full flex flex-col lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0">
        <div className="w-full  lg:flex-3 flex flex-row justify-start items-center">
          {/* input search */}
          <InputSearch
            handleSearch={handleSearch}
            placeholder="Cari kategori berdasarkan nama"
          />
        </div>

        <div className="w-full flex-wrap lg:flex-2 flex flex-row justify-start lg:justify-end items-center gap-4">
          {/* filter sort */}
          <FilterSort setSort={handleSort} />

          {/* button add  */}
          <div className="lg:hidden block">
            <ButtonAdd
              icon={Tag}
              label="Tambah Kategori"
              handleBtn={() => handleShowModalFormulirKategori()}
              size="xs"
            />
          </div>
        </div>
      </div>

      {/* content */}
      <div className="w-full flex flex-col justify-start items-center gap-4 mt-4">
        {isLoadingKategoriProduk ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-full h-18 skeleton" />
          ))
        ) : isExistDataKategoriProduk ? (
          dataKategoriProduk?.data?.data.map((item) => (
            <CardKategoriProduk
              key={item.id}
              data={item}
              handleUpdate={handleShowModalFormulirKategori}
              handleDelete={() => handleShowModalDelete(item.id, item.nama)}
            />
          ))
        ) : (
          <DataEmpty
            iconData={Tag}
            title="Data Kategori Produk Tidak Tersedia"
          />
        )}
      </div>

      {/* pagination and limits */}
      <PaginationAndLimit
        currentPage={dataKategoriProduk?.data?.meta.currentPage || null}
        totalPage={dataKategoriProduk?.data?.meta.totalPage || null}
        setPage={handlePage}
        setLimit={handleLimit}
        customPositionPagination="end"
        customWindowSize={3}
        emptyData={!isExistDataKategoriProduk}
      />

      {/* modal  */}
      <ModalFormulirKategoriProduk
        {...(dataKategoriForUpdate && {
          dataUpdate: dataKategoriForUpdate,
        })}
        modalRef={modalFormulirKategoriRef}
        handleCloseModal={handleCloseModalFormulirKategori}
      />

      {/* modal delete */}
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDelete}
        isLoadingDelete={isPendingDelete}
        bigTitle={`Apakah anda yakin ingin menghapus data "${dataDelete}" ?`}
      />
    </div>
  );
};

type KategoriProdukProps = {
  data: ResponseKategoriProdukType;
  handleDelete: () => void;
  handleUpdate: (id: number) => void;
};

// card kategori produk
const CardKategoriProduk: FC<KategoriProdukProps> = ({
  data,
  handleDelete,
  handleUpdate,
}) => {
  return (
    <div className="w-full flex flex-row justify-start items-center min-h-18 rounded-md border border-base-content/20 px-4 py-2">
      <div className="flex-2 flex flex-row justify-start items-center h-full gap-3">
        <Tag className="size-5 text-base-content" />
        <span className="text-base-content font-semibold text-[0.625rem] lg:text-sm">
          {data.nama}
        </span>
      </div>

      <div className="flex-2 flex flex-col justify-center items-start">
        <span className="text-[0.625rem] font-semibold">Keterangan:</span>
        <span className="text-[0.625rem] lg:text-[0.7rem]">
          {data.keterangan || "-"}
        </span>
      </div>

      {/* aksi */}
      <div className="lg:flex-1 flex flex-row justify-end items-center mx-1">
        <div className="w-full hidden lg:flex flex-row justify-end items-center gap-2.5">
          <button
            type="button"
            className="btn btn-xs btn-info text-primary-white"
            onClick={() => handleUpdate?.(data.id)}
          >
            Ubah
          </button>
          <button
            type="button"
            className="btn btn-xs btn-error text-primary-white"
            onClick={() => handleDelete()}
          >
            Hapus
          </button>
        </div>

        {/* dropdowm */}
        <div className="lg:hidden h-9 flex dropdown dropdown-left dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="h-full flex flex-row justify-center items-center px-1"
          >
            <EllipsisVertical className="size-3" />
          </div>
          <ul
            tabIndex={-1}
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-30 p-2 shadow-sm gap-2"
          >
            <li>
              <button
                type="button"
                className="text-info font-semibold"
                onClick={() => handleUpdate(data.id)}
              >
                Ubah
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-error font-semibold"
                onClick={handleDelete}
              >
                Hapus
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
