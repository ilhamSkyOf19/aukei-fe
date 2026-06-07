import { Ellipsis, EllipsisVertical, PencilLine, Trash } from "lucide-react";
import { formatNumber, formatRupiah } from "../../../../helpers/helpers";
import DataEmpty from "../../../../components/messages/DataEmpty";
import type { ResponseStructure } from "../../../../types/response.type";
import type { ResponseBarangMasukWithDetailType } from "../../../../models/barangMasuk.model";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";
import LabelButtonDropDownWithIcon from "../../../../components/ui/button/LabelButtonDropDownWithIcon";
import useShowBarangMasuk from "./useShowBarangMasuk";
import ModalDelete from "../../../../components/modals/ModalDelete";
import type { UpdateBarangMasukDetailType } from "../../../../models/barangMasukDetail.model";
import InputNumber from "../../../../components/inputs/InputNumber";
import ModalGantiProdukMasuk from "../../../../components/modals/ModalGantiProdukMasuk";
import CardForm from "../../../../components/inputs/CardForm";
import ButtonInline from "../../../../components/ui/button/ButtonInline";

type Props = {
  isLoadingBarangMasukDetail?: boolean;
  dataBarangMasukDetail?: ResponseStructure<ResponseBarangMasukWithDetailType | null>;
};
const ShowDataBarangMasuk: FC<Props> = ({
  dataBarangMasukDetail,
  isLoadingBarangMasukDetail,
}) => {
  const {
    handleSetIsActiveAksi,
    isActiveAksi,
    wrapperRef,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    dataDelete,
    modalDeleteRef,
    dataUpdate,
    handleClearDataUpdate,
    handleSetDataUpdate,
    handleSubmit,
    isPendingUpdate,
    onSubmit,
    isStatusPosted,
    isDirty,
    jumlahBoxController,
    handleCloseModalGantiProduk,
    handleShowModalGantiProduk,
    idBarangMasuk,
    modalGantiProdukRef,
  } = useShowBarangMasuk({
    status: dataBarangMasukDetail?.data?.status,
  });

  // existing data
  const isExistData =
    dataBarangMasukDetail?.data &&
    dataBarangMasukDetail?.data?.detailBarangMasuks?.length > 0
      ? true
      : false;

  return (
    <>
      {/* for sm */}
      <div className="w-full card dark:border dark:border-base-content/10 flex flex-col justify-start items-center mt-2 gap-3 lg:hidden">
        {/* data empty */}
        {isLoadingBarangMasukDetail ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-20 skeleton shadow-xs border border-base-content/10"
            />
          ))
        ) : isExistData ? (
          dataBarangMasukDetail?.data?.detailBarangMasuks?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col p-3 justify-start items-start w-full card bg-base-100 shadow-xs min-h-20 gap-2"
            >
              {/* content one */}
              <div className="w-full h-full flex flex-row justify-start items-start gap-3">
                {/* img */}
                <div className="flex-1 flex flex-row justify-start items-center">
                  <div className="w-12.5 h-12 overflow-hidden bg-black rounded-md">
                    <img
                      src={item.produk.img}
                      alt="foto produk"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-start items-center w-full">
                  {/* nama */}
                  <div className="w-full flex flex-row justify-between items-start">
                    <div className="w-full flex flex-col justify-start items-start gap-1">
                      <p className="text-base-content text-sm font-semibold">
                        {item.produk.nama}
                      </p>
                      <p className="text-base-content/50 text-[0.7rem] font-medium">
                        {item.produk.kode}
                      </p>
                    </div>

                    {/* button aksi */}
                    <div className="flex flex-row justify-end items-start">
                      {!isStatusPosted && (
                        <div className="sticky right-0 bg-base-100 z-10">
                          <div
                            ref={wrapperRef}
                            className={cn(
                              "dropdown dropdown-left dropdown-end",
                            )}
                          >
                            <button
                              type="button"
                              role="button"
                              tabIndex={0}
                              className="m-1"
                              onFocus={() => handleSetIsActiveAksi(item.id)}
                              onBlur={() => handleSetIsActiveAksi(0)}
                            >
                              <Ellipsis className="size-4" />
                            </button>
                            <ul
                              tabIndex={-1}
                              className="z-1 dark:border dark:border-base-content/10 dropdown-content menu bg-base-100 rounded-box w-35 lg:w-40 p-2 shadow-sm space-y-2"
                            >
                              <li>
                                <LabelButtonDropDownWithIcon
                                  label="Ganti Produk"
                                  icon={PencilLine}
                                  handleClick={() =>
                                    handleShowModalGantiProduk(item.id)
                                  }
                                />
                              </li>
                              <li>
                                <LabelButtonDropDownWithIcon
                                  color="text-error"
                                  label="Hapus"
                                  icon={Trash}
                                  handleClick={() =>
                                    handleShowModalDelete(item.id, {
                                      nama: item.produk.nama,
                                    })
                                  }
                                />
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row justify-start items-start gap-2">
                {/* data */}
                <div className="w-full flex flex-row justify-start items-end mt-2 flex-wrap gap-2">
                  {/* harga beli */}
                  <div className="w-30 flex flex-col justify-start items-start gap-0.5">
                    <span className="text-[0.625rem] text-base-content/50">
                      Harga Beli
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {formatRupiah(item.produk.hargaBeli)}
                    </span>
                  </div>
                  {/* box */}
                  <div className="w-12 flex flex-col justify-start items-start gap-0.5">
                    <span className="text-[0.625rem] font-medium text-base-content/50">
                      Box
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {item.jumlahBox}
                    </span>
                  </div>
                  {/* isi */}
                  <div className="w-12 flex flex-col justify-start items-start gap-0.5">
                    <span className="text-[0.625rem] font-medium text-base-content/50">
                      Isi
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {item.produk.isiPerBox}
                    </span>
                  </div>
                  {/* total */}
                  <div className="w-30 flex flex-col justify-start items-start gap-0.5">
                    <span className="text-[0.625rem] font-medium text-base-content/50">
                      Total
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {formatRupiah(
                        item.produk.isiPerBox *
                          item.jumlahBox *
                          item.produk.hargaBeli,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <DataEmpty
            title="Data Barang Masuk Tidak Tersedia"
            description="Belum ada data barang masuk yang dapat ditampilkan saat ini"
          />
        )}
      </div>

      {/* for lg */}
      <div className="w-full hidden lg:flex card bg-base-100 dark:border dark:border-base-content/10 mt-3 flex-col justify-start items-start p-4">
        {/* header */}

        <div className="w-full flex flex-row justify-between items-center">
          <p className="text-base font-semibold">Daftar Barang Masuk</p>

          {/* count */}
          <p className="text-xs px-3 py-1 rounded-full font-medium bg-gray-300">
            {dataBarangMasukDetail?.data?.detailBarangMasuks.length} barang
          </p>
        </div>

        <div className="overflow-x-auto w-full my-8">
          <table className="table table-xs lg:table-sm">
            {/* head */}
            <thead>
              <tr>
                <th>No</th>
                <th>Foto</th>
                <th>Kode</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Harga Beli Satuan</th>
                <th>Jumlah Box</th>
                <th>Isi PerBox</th>
                <th>Total</th>
                {!isStatusPosted && (
                  <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoadingBarangMasukDetail ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={10}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : isExistData ? (
                dataBarangMasukDetail?.data?.detailBarangMasuks.map(
                  (item, index) => (
                    <tr
                      key={item.id}
                      className={cn(
                        "transition-all duration-75 ease-in-out",
                        isActiveAksi === item.id && "bg-base-200",
                      )}
                    >
                      <th>{index + 1}</th>
                      {/* foto */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10 lg:h-12 lg:w-12">
                              <img src={item.produk.img} alt="Foto Produk" />
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* kode */}
                      <td className="font-semibold text-info">
                        {item.produk.kode}
                      </td>
                      {/* nama */}
                      <td className="text-base-content">{item.produk.nama}</td>
                      {/* kategori */}
                      <td className="text-base-content">
                        {item.produk.kategori.nama}
                      </td>
                      {/* harga beli */}
                      <td className="text-base-content">
                        {formatRupiah(item.produk.hargaBeli)}
                      </td>

                      {/* jumlah perbox */}
                      <td className="font-medium text-base-content">
                        {dataUpdate?.id === item.id ? (
                          <CardForm<UpdateBarangMasukDetailType>
                            handleResetForm={handleClearDataUpdate}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            isPending={isPendingUpdate}
                            btnAksiPosition="top"
                            isDirty={isDirty}
                          >
                            {/* input text */}
                            <div className="w-50">
                              <InputNumber<UpdateBarangMasukDetailType>
                                controller={jumlahBoxController}
                                placeholder="Masukkan Jumlah Box"
                                required
                                xs
                              />
                            </div>
                          </CardForm>
                        ) : (
                          <div className="flex flex-row justify-start items-start gap-2">
                            <span>
                              {formatNumber(item.jumlahBox.toString())}
                            </span>

                            {/* button update */}
                            <ButtonInline
                              handleKeyUpdate={() =>
                                handleSetDataUpdate({
                                  data: {
                                    id: item.id,
                                    jumlahBox: item.jumlahBox,
                                    produkId: item.produk.id,
                                  },
                                })
                              }
                            />
                          </div>
                        )}
                      </td>

                      {/* isi perbox */}
                      <td className="font-medium text-base-content">
                        {formatNumber(item.produk.isiPerBox.toString())}
                      </td>

                      {/* total */}
                      <td className="font-medium text-base-content">
                        {formatRupiah(
                          item.produk.hargaBeli *
                            (item.produk.isiPerBox * item.jumlahBox),
                        )}
                      </td>

                      {/* detail */}
                      {!isStatusPosted && (
                        <td className="sticky right-0 bg-base-100 z-10">
                          <div
                            ref={wrapperRef}
                            className={cn(
                              "dropdown dropdown-left dropdown-end",
                            )}
                          >
                            <button
                              type="button"
                              role="button"
                              tabIndex={0}
                              className="btn btn-sm m-1"
                              onFocus={() => handleSetIsActiveAksi(item.id)}
                              onBlur={() => handleSetIsActiveAksi(0)}
                            >
                              <EllipsisVertical className="size-4" />
                            </button>
                            <ul
                              tabIndex={-1}
                              className="z-1 dark:border dark:border-base-content/10 dropdown-content menu bg-base-100 rounded-box w-35 lg:w-40 p-2 shadow-sm space-y-2"
                            >
                              <li>
                                <LabelButtonDropDownWithIcon
                                  label="Ganti Produk"
                                  icon={PencilLine}
                                  handleClick={() =>
                                    handleShowModalGantiProduk(item.id)
                                  }
                                />
                              </li>
                              <li>
                                <LabelButtonDropDownWithIcon
                                  color="text-error"
                                  label="Hapus"
                                  icon={Trash}
                                  handleClick={() =>
                                    handleShowModalDelete(item.id, {
                                      nama: item.produk.nama,
                                    })
                                  }
                                />
                              </li>
                            </ul>
                          </div>
                        </td>
                      )}
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td colSpan={10}>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <DataEmpty
                        title="Data Produk Tidak Tersedia"
                        description="Belum ada data produk yang dapat ditampilkan saat ini."
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            {/* foot */}
            {!isLoadingBarangMasukDetail &&
              isExistData &&
              dataBarangMasukDetail?.data?.detailBarangMasuks?.length! > 8 && (
                <tfoot>
                  <tr>
                    <th></th>
                    <th>Foto</th>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Harga Beli Satuan</th>
                    <th>Jumlah Box</th>
                    <th>Isi PerBox</th>
                    {!isStatusPosted && (
                      <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
                    )}
                  </tr>
                </tfoot>
              )}
          </table>
        </div>
      </div>

      {/* modal delete */}
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDelete}
        isLoadingDelete={isPendingDelete}
        bigTitle={`Apakah anda yakin ingin menghapus data barang "${dataDelete?.nama}" ini?`}
      />

      {/* modal ganti produk */}
      <ModalGantiProdukMasuk
        modalRef={modalGantiProdukRef}
        handleCloseModal={handleCloseModalGantiProduk}
        idBarangMasuk={idBarangMasuk}
        status={dataBarangMasukDetail?.data?.status}
      />
    </>
  );
};

export default ShowDataBarangMasuk;
