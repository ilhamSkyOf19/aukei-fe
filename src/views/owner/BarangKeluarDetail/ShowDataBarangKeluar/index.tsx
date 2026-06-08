import { Ellipsis, EllipsisVertical, PencilLine, Trash } from "lucide-react";
import { formatNumber, formatRupiah } from "../../../../helpers/helpers";
import DataEmpty from "../../../../components/messages/DataEmpty";
import type { ResponseStructure } from "../../../../types/response.type";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";
import LabelButtonDropDownWithIcon from "../../../../components/ui/button/LabelButtonDropDownWithIcon";
import ModalDelete from "../../../../components/modals/ModalDelete";
import type { UpdateBarangMasukDetailType } from "../../../../models/barangMasukDetail.model";
import CardForm from "../../../../components/inputs/CardForm";
import ButtonInline from "../../../../components/ui/button/ButtonInline";
import type { ResponseBarangKeluarWithDetailType } from "../../../../models/barangKeluar.model";
import useShowBarangKeluar from "./useShowBarangKeluar";
import type { UpdateBarangKeluarDetailType } from "../../../../models/barangKeluarDetail.model";
import InputPrice from "../../../../components/inputs/InputPrice";
import ModalUbahProdukKeluar from "../../../../components/modals/ModalUbahProdukKeluar";
import { STATUS_INVENTORI_TYPE } from "../../../../types/constant.type";
import InputNumber from "../../../../components/inputs/InputNumber";

type Props = {
  isLoadingBarangKeluarDetail?: boolean;
  dataBarangKeluarDetail?: ResponseStructure<ResponseBarangKeluarWithDetailType | null>;
};
const ShowDataBarangKeluar: FC<Props> = ({
  dataBarangKeluarDetail,
  isLoadingBarangKeluarDetail,
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
    jumlahStokController,
    handleCloseModalUbahProduk,
    handleShowModalUbahProduk,
    idBarangKeluar,
    modalUbahProdukRef,
    hargaModalSatuanController,
    dataUpdateBarangKeluar,
  } = useShowBarangKeluar({
    status: dataBarangKeluarDetail?.data?.status,
  });

  // existing data
  const isExistData =
    dataBarangKeluarDetail?.data &&
    dataBarangKeluarDetail?.data?.detailBarangKeluars?.length > 0
      ? true
      : false;

  return (
    <>
      {/* for sm */}
      <div className="w-full card dark:border dark:border-base-content/10 flex flex-col justify-start items-center mt-2 gap-3 lg:hidden">
        {/* data empty */}
        {isLoadingBarangKeluarDetail ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-20 skeleton shadow-xs border border-base-content/10"
            />
          ))
        ) : isExistData ? (
          dataBarangKeluarDetail?.data?.detailBarangKeluars?.map((item) => (
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
                                  label="Ubah Produk"
                                  icon={PencilLine}
                                  handleClick={() =>
                                    handleShowModalUbahProduk(item.id, {
                                      produkId: item.produk.id,
                                      hargaModalSatuan: item.hargaModalSatuan,
                                      jumlahStok: item.jumlahStok,
                                    })
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
                  <div className="flex-2 flex flex-col justify-start items-start gap-0.5">
                    <span className="text-[0.625rem] text-base-content/50">
                      Harga Modal Satuan
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {formatRupiah(item.hargaModalSatuan)}
                    </span>
                  </div>
                  {/* box */}
                  <div className="flex-1 flex flex-col justify-start items-start gap-0.5">
                    <span className="text-[0.625rem] font-medium text-base-content/50">
                      Jumlah Stok
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {item.jumlahStok}
                    </span>
                  </div>
                  {/* total */}
                  <div className="flex-2 flex flex-col justify-start items-start gap-0.5">
                    <span className="text-[0.625rem] font-medium text-base-content/50">
                      Total
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {formatRupiah(item.jumlahStok * item.hargaModalSatuan)}
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
          <p className="text-base font-semibold">Daftar Barang Keluar</p>

          {/* count */}
          <p className="text-xs px-3 py-1 rounded-full font-medium bg-gray-300">
            {dataBarangKeluarDetail?.data?.detailBarangKeluars.length} barang
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
                <th>Harga Modal Satuan</th>
                <th>Jumlah Stok</th>
                <th>Total</th>
                {!isStatusPosted && (
                  <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoadingBarangKeluarDetail ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={10}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : isExistData ? (
                dataBarangKeluarDetail?.data?.detailBarangKeluars.map(
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

                      {/* jumlah perbox */}
                      <td className="font-medium text-base-content">
                        {dataUpdate?.type === "hargaModalSatuan" &&
                        dataUpdate?.id === item.id ? (
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
                              <InputPrice<UpdateBarangKeluarDetailType>
                                controller={hargaModalSatuanController}
                                placeholder="Harga Modal Satuan"
                                required
                                xs
                              />
                            </div>
                          </CardForm>
                        ) : (
                          <div className="flex flex-row justify-start items-start gap-2">
                            <span>
                              {formatRupiah(item.hargaModalSatuan.toString())}
                            </span>

                            {/* button update */}
                            {dataBarangKeluarDetail?.data?.status ===
                              STATUS_INVENTORI_TYPE.DRAFT && (
                              <ButtonInline
                                handleKeyUpdate={() =>
                                  handleSetDataUpdate({
                                    data: {
                                      id: item.id,
                                      hargaModalSatuan: item.hargaModalSatuan,
                                      type: "hargaModalSatuan",
                                    },
                                  })
                                }
                              />
                            )}
                          </div>
                        )}
                      </td>

                      {/* jumlah stok */}
                      <td className="font-medium text-base-content">
                        {dataUpdate?.type === "jumlahStok" &&
                        dataUpdate?.id === item.id ? (
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
                              <InputNumber<UpdateBarangKeluarDetailType>
                                controller={jumlahStokController}
                                placeholder="Jumlah Stok"
                                required
                                xs
                              />
                            </div>
                          </CardForm>
                        ) : (
                          <div className="flex flex-row justify-start items-start gap-2">
                            <span>
                              {formatNumber(item.jumlahStok.toString())}
                            </span>

                            {/* button update */}
                            {dataBarangKeluarDetail?.data?.status ===
                              STATUS_INVENTORI_TYPE.DRAFT && (
                              <ButtonInline
                                handleKeyUpdate={() =>
                                  handleSetDataUpdate({
                                    data: {
                                      id: item.id,
                                      jumlahStok: item.jumlahStok,
                                      type: "jumlahStok",
                                    },
                                  })
                                }
                              />
                            )}
                          </div>
                        )}
                      </td>

                      {/* total */}
                      <td className="font-medium text-base-content">
                        {formatRupiah(item.hargaModalSatuan * item.jumlahStok)}
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
                                  label="Ubah Produk"
                                  icon={PencilLine}
                                  handleClick={() =>
                                    handleShowModalUbahProduk(item.id, {
                                      produkId: item.produk.id,
                                      hargaModalSatuan: item.hargaModalSatuan,
                                      jumlahStok: item.jumlahStok,
                                    })
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
            {!isLoadingBarangKeluarDetail &&
              isExistData &&
              dataBarangKeluarDetail?.data?.detailBarangKeluars?.length! >
                8 && (
                <tfoot>
                  <tr>
                    <th></th>
                    <th>Foto</th>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Harga Modal Satuan</th>
                    <th>Jumlah Stok</th>
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

      {/* modal Ubah produk */}
      <ModalUbahProdukKeluar
        modalRef={modalUbahProdukRef}
        handleCloseModal={handleCloseModalUbahProduk}
        idBarangKeluar={idBarangKeluar}
        status={dataBarangKeluarDetail?.data?.status}
        dataUpdate={{
          hargaModalSatuan: dataUpdateBarangKeluar?.hargaModalSatuan,
          jumlahStok: dataUpdateBarangKeluar?.jumlahStok,
          produkId: dataUpdateBarangKeluar?.produkId,
        }}
      />
    </>
  );
};

export default ShowDataBarangKeluar;
