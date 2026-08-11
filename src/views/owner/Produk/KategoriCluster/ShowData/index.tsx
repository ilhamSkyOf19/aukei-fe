import { type FC } from "react";
import PaginationAndLimit from "../../../../../components/filters/PaginationAndLimit";
import useShowData from "./useShowData";
import InputSearch from "../../../../../components/inputs/InputSearch";
import FilterSort from "../../../../../components/filters/Sort";
import { EllipsisVertical, Pencil, Tag, Trash2 } from "lucide-react";
import type { ResponseKategoriProdukType } from "../../../../../models/kategoriProduk.model";
import DataEmpty from "../../../../../components/messages/DataEmpty";
import ModalFormulirKategoriProduk from "../../../../../components/modals/ModalFormulirKategoriProduk";
import ModalDelete from "../../../../../components/modals/ModalDelete";
import ButtonWithIcon from "../../../../../components/ui/button/ButtonWithIcon";
import LabelButtonDropDownWithIcon from "../../../../../components/ui/button/LabelButtonDropDownWithIcon";
import ButtonText from "../../../../../components/ui/button/ButtonText";
import LoadingFetch from "../../../../../components/ui/LoadingFetch";

type Props = {
  handleSetAlert: (alert: string) => void;
  handleSetToast: (toast: string) => void;
};
const ShowData: FC<Props> = ({ handleSetAlert, handleSetToast }) => {
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
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
    dataDelete,
  } = useShowData({ handleSetAlert, handleSetToast });

  return (
    <div className="lg:rounded-xl flex-2 lg:bg-base-100 flex flex-col justify-start items-start lg:h-[75vh] border border-transparent dark:border-base-content/10">
      {/* filter */}
      <div className="rounded-2xl bg-base-100 p-2.5 w-full flex flex-col md:flex-row justify-start items-start lg:mb-0">
        {/* button add  */}
        <div className="md:hidden block w-full mb-3">
          <ButtonWithIcon
            icon={Tag}
            label="Tambah Kategori"
            handleBtn={() => handleShowModalFormulirKategori()}
            customWidth="w-full"
          />
        </div>
        <div className="w-full flex-1 flex flex-row justify-start items-center">
          {/* input search */}
          <InputSearch
            handleSearch={handleSearch}
            placeholder="Cari kategori berdasarkan nama ..."
            withLabel
          />
        </div>
        <div className="w-full md:flex-2 lg:flex-1 flex flex-row justify-end items-start md:items-end md:gap-3 lg:gap-0 mt-3 md:mt-0">
          {/* filter sort */}
          <FilterSort setSort={handleSort} customWidth="w-full md:w-40" />

          <div className="hidden lg:hidden md:block md:mb-0 mb-3">
            <ButtonWithIcon
              icon={Tag}
              label="Tambah Kategori"
              handleBtn={() => handleShowModalFormulirKategori()}
              customWidth="w-full"
            />
          </div>
        </div>
      </div>

      {/* content */}
      <div className="w-full flex flex-col justify-start items-center gap-2 lg:overflow-y-auto lg:py-2.5 lg:px-2.5 scrollbar-thumb-custom-secondary scrollbar-thin mt-2.5">
        {isLoadingKategoriProduk ? (
          <LoadingFetch />
        ) : isExistDataKategoriProduk ? (
          dataKategoriProduk?.data?.data.map((item) => (
            <CardKategoriProduk
              key={item.id}
              data={item}
              handleUpdate={handleShowModalFormulirKategori}
              handleDelete={() =>
                handleShowModalDelete(item.id, { nama: item.nama })
              }
            />
          ))
        ) : (
          <DataEmpty
            iconData={Tag}
            title="Data Kategori Produk Tidak Tersedia"
            xs
          />
        )}
      </div>

      {/* pagination and limits */}
      <div className="w-full lg:px-2.5 py-1.5">
        <PaginationAndLimit
          currentPage={dataKategoriProduk?.data?.meta.currentPage || null}
          totalPage={dataKategoriProduk?.data?.meta.totalPage || null}
          setPage={handlePage}
          setLimit={handleLimit}
          customPositionPagination="end"
          customWindowSize={3}
          emptyData={!isExistDataKategoriProduk}
          limit={dataKategoriProduk?.data?.meta?.limit}
        />
      </div>

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
        bigTitle={`Apakah anda yakin ingin menghapus data ini?`}
        highlightData={dataDelete?.nama}
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
    <div className="w-full flex flex-row justify-start items-center min-h-18 rounded-2xl border border-base-content/20 px-4 py-2 bg-base-100">
      <div className="flex-2 flex flex-row justify-start items-center h-full gap-3">
        <Tag className="size-5 text-base-content" />
        <span className="text-base-content font-semibold text-xs">
          {data.nama}
        </span>
      </div>

      <div className="flex-2 flex flex-col justify-center items-start">
        <span className="text-[0.7rem] font-semibold text-base-content">
          Keterangan:
        </span>
        <span className="text-[0.7rem] lg:text-[0.7rem] text-base-content">
          {data.keterangan || "-"}
        </span>
      </div>

      {/* aksi */}
      <div className="lg:flex-1 flex flex-row justify-end items-center mx-1">
        <div className="w-full hidden md:flex flex-row justify-end items-center gap-2.5">
          <ButtonText
            bgColor="bg-info"
            textColor="text-primary-white"
            handleClick={() => handleUpdate?.(data.id)}
            label="Update"
          />
          <ButtonText
            bgColor="bg-error"
            textColor="text-primary-white"
            handleClick={() => handleDelete()}
            label="Hapus"
          />
        </div>

        {/* dropdowm */}
        <div className="md:hidden h-9 flex dropdown dropdown-left dropdown-end">
          <button
            type="button"
            tabIndex={0}
            role="button"
            className="h-full flex flex-row justify-center items-center px-1 border border-base-content/20 rounded-md"
          >
            <EllipsisVertical className="size-3 text-base-content" />
          </button>
          <ul
            tabIndex={-1}
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-30 p-2 shadow-sm gap-2 border border-transparent dark:border-base-content/10"
          >
            <li>
              <LabelButtonDropDownWithIcon
                icon={Pencil}
                handleClick={() => handleUpdate(data.id)}
                label="Ubah"
                color="text-info"
              />
            </li>
            <li>
              <LabelButtonDropDownWithIcon
                icon={Trash2}
                handleClick={() => handleDelete()}
                label="Hapus"
                color="text-error"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
