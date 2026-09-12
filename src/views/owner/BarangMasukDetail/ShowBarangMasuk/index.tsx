import {
  formatNumber,
  formatNumberK,
  formatRupiah,
  formatRupiahShort,
} from "../../../../helpers/helpers";
import DataEmpty from "../../../../components/messages/DataEmpty";
import type { ResponseStructure } from "../../../../types/response.type";
import type { ResponseBarangMasukWithDetailType } from "../../../../models/barangMasuk.model";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";
import useShowBarangMasuk from "./useShowBarangMasuk";
import ModalDelete from "../../../../components/modals/ModalDelete";
import type { UpdateBarangMasukDetailType } from "../../../../models/barangMasukDetail.model";
import InputNumber from "../../../../components/inputs/InputNumber";
import ModalUbahProdukMasuk from "../../../../components/modals/ModalUbahProdukMasuk";
import CardForm from "../../../../components/inputs/CardForm";
import ButtonInline from "../../../../components/ui/button/ButtonInline";
import {
  ROLE_INTERNAL_TYPE,
  STATUS_INVENTORI_TYPE,
  type RoleInternalType,
} from "../../../../types/constant.type";
import InputPrice from "../../../../components/inputs/InputPrice";
import ButtonUpdateTable from "../../../../components/ui/button/ButtonUpdateTable";
import ButtonDeleteTable from "../../../../components/ui/button/ButtonDeleteTable";
import LoadingFetch from "../../../../components/ui/LoadingFetch";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";

type Props = {
  isLoadingBarangMasukDetail?: boolean;
  dataBarangMasukDetail?: ResponseStructure<ResponseBarangMasukWithDetailType | null>;
  fromPengajuanBarang?: boolean;
  role?: RoleInternalType;
};
const ShowDataBarangMasuk: FC<Props> = ({
  dataBarangMasukDetail,
  isLoadingBarangMasukDetail,
  fromPengajuanBarang,
  role,
}) => {
  const {
    isActiveAksi,
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
    handleCloseModalUbahProduk,
    handleShowModalUbahProduk,
    idBarangMasuk,
    modalUbahProdukRef,
    dataUpdateBarangMasuk,
    hargaBeliController,
    jumlahStokController,
  } = useShowBarangMasuk({
    status: dataBarangMasukDetail?.data?.status,
  });

  const roleOwner = role === ROLE_INTERNAL_TYPE.OWNER;

  // existing data
  const isExistData =
    dataBarangMasukDetail?.data &&
    dataBarangMasukDetail?.data?.detailBarangMasuks?.length > 0
      ? true
      : false;

  // is rejected kasir
  const isRejectedKasir =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.REJECTED &&
    role === ROLE_INTERNAL_TYPE.KASIR;

  // const is draft owner
  const isDrafOwner =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT &&
    roleOwner;

  return (
    <>
      {/* for sm */}
      <div className="w-full flex flex-col justify-start items-center mt-2 gap-3 lg:hidden">
        {isLoadingBarangMasukDetail ? (
          <LoadingFetch />
        ) : isExistData ? (
          dataBarangMasukDetail?.data?.detailBarangMasuks?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col p-3 justify-start items-start w-full rounded-2xl md:rounded-xl bg-base-100 shadow-xs min-h-20 gap-1"
            >
              {/* content one */}
              <div className="w-full h-full flex flex-row justify-start items-start gap-3 pb-2 border-b border-base-content/10">
                {/* img */}
                <div className="flex-1 flex flex-row justify-start items-center">
                  <div className="w-12.5 h-12 overflow-hidden bg-black rounded-2xl">
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
                      <p className="text-base-content/50 text-[0.625rem]">
                        {item.produk.kode}
                      </p>
                    </div>

                    {/* button aksi */}
                    <div className="flex flex-row justify-end items-start gap-2.5">
                      {!isStatusPosted && (
                        <>
                          <ButtonWithIcon
                            customHeight="h-8"
                            label="Hapus"
                            bgColor="bg-error"
                            textColor="text-primary-white"
                            handleBtn={() =>
                              handleShowModalDelete(item.id, {
                                nama: item.produk.nama,
                              })
                            }
                          />

                          <ButtonWithIcon
                            customHeight="h-8"
                            label="Ubah"
                            bgColor="bg-info"
                            textColor="text-primary-white"
                            handleBtn={() =>
                              handleShowModalUbahProduk(item.id, {
                                jumlahBox: item.jumlahBox,
                                produk: item.produk,
                                hargaBeli: item.produk.hargaBeli,
                              })
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row justify-start items-start gap-2">
                {/* data */}
                <div className="w-full flex flex-row justify-start items-end mt-2 flex-wrap gap-2.5">
                  {/* harga beli */}
                  <div className="flex-1 flex flex-col justify-start items-start gap-0.5 border-r border-base-content/10">
                    <span className="text-[0.625rem] text-base-content/50">
                      Harga Beli
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {formatRupiahShort(item.produk.hargaBeli)}
                    </span>
                  </div>
                  {/* box */}
                  <div className="flex-1 flex flex-col justify-start items-start gap-0.5 border-r border-base-content/10">
                    <span className="text-[0.625rem] font-medium text-base-content/50">
                      Box
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {formatNumberK(item.jumlahBox)}
                    </span>
                  </div>
                  {/* isi */}
                  <div className="flex-1 flex flex-col justify-start items-start gap-0.5 border-r border-base-content/10">
                    <span className="text-[0.625rem] font-medium text-base-content/50">
                      Isi / Box
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {formatNumberK(item.produk.isiPerBox)}
                    </span>
                  </div>
                  {/* total */}
                  <div className="flex-1 flex flex-col justify-start items-start gap-0.5">
                    <span className="text-[0.625rem] font-medium text-base-content/50">
                      Total Nilai
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {formatRupiahShort(
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
          <div className="w-full flex flex-row justify-center items-center py-4 border rounded-2xl md:rounded-xl border-base-content/10">
            <DataEmpty
              title="Data Barang Masuk Tidak Tersedia"
              description="Belum ada data barang masuk yang dapat ditampilkan saat ini"
            />
          </div>
        )}
      </div>

      {/* for lg */}
      <div className="w-full hidden lg:flex bg-base-100 dark:border dark:border-base-content/10 flex-col justify-start items-start rounded-2xl md:rounded-xl gap-4 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="table table-xs lg:table-sm table-zebra">
            {/* head */}
            <thead>
              <tr className="text-xs h-12 text-[0.7rem] bg-base-200">
                <th>No</th>
                <th>Foto</th>
                <th>Nama</th>
                <th>Kode</th>
                <th>Kategori</th>
                {roleOwner && <th>Hrg. Beli Terakhir</th>}
                <th>Jml. Box</th>
                <th>Isi / Box</th>
                <th>Total Item</th>
                {roleOwner && <th>Total Nilai</th>}
                {(isRejectedKasir ||
                  isDrafOwner ||
                  dataBarangMasukDetail?.data?.status ===
                    STATUS_INVENTORI_TYPE.DRAFT) && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {isLoadingBarangMasukDetail ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={11}>
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
                        "transition-all duration-75 ease-in-out text-base-content text-[0.7rem]",
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
                      {/* nama */}
                      <td>{item.produk.nama}</td>

                      {/* kode */}
                      <td>{item.produk.kode ?? "-"}</td>

                      {/* kategori */}
                      <td>{item.produk.kategori.nama}</td>
                      {/* harga beli */}
                      {roleOwner && (
                        <td className="font-medium">
                          {dataUpdate?.id === item.id &&
                          dataUpdate.isActive === "hargaBeli" ? (
                            <CardForm<UpdateBarangMasukDetailType>
                              handleResetForm={handleClearDataUpdate}
                              handleSubmit={handleSubmit}
                              onSubmit={onSubmit}
                              isPending={isPendingUpdate}
                              btnAksiPosition="top"
                              isDirty={isDirty}
                            >
                              {/* input text */}
                              <div className="w-40">
                                <InputPrice<UpdateBarangMasukDetailType>
                                  controller={hargaBeliController}
                                  placeholder="Harga beli"
                                  required
                                  xs
                                />
                              </div>
                            </CardForm>
                          ) : (
                            <div className="flex flex-row justify-start items-start gap-2">
                              <span>{formatRupiah(item.produk.hargaBeli)}</span>

                              {/* button update */}
                              {(isRejectedKasir ||
                                isDrafOwner ||
                                dataBarangMasukDetail?.data?.status ===
                                  STATUS_INVENTORI_TYPE.DRAFT) &&
                                !fromPengajuanBarang && (
                                  <ButtonInline
                                    handleKeyUpdate={() =>
                                      handleSetDataUpdate({
                                        data: {
                                          id: item.id,
                                          produkId: item.produk.id,
                                          hargaBeli: item.produk.hargaBeli,
                                        },
                                      })
                                    }
                                  />
                                )}
                            </div>
                          )}
                        </td>
                      )}
                      {/* jumlah perbox */}
                      <td
                        className={cn(
                          "font-medium",
                          dataUpdate?.id === item.id &&
                            dataUpdate.isActive === "jumlahBox" &&
                            "w-50",
                        )}
                      >
                        {dataUpdate?.id === item.id &&
                        dataUpdate.isActive === "jumlahBox" ? (
                          <CardForm<UpdateBarangMasukDetailType>
                            handleResetForm={handleClearDataUpdate}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            isPending={isPendingUpdate}
                            btnAksiPosition="top"
                            isDirty={isDirty}
                          >
                            {/* input text */}
                            <div className="w-20">
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
                            {(isRejectedKasir ||
                              isDrafOwner ||
                              dataBarangMasukDetail?.data?.status ===
                                STATUS_INVENTORI_TYPE.DRAFT) && (
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
                            )}
                          </div>
                        )}
                      </td>

                      {/* isi perbox */}
                      <td className="font-medium">
                        {formatNumber(item.produk.isiPerBox.toString())}
                      </td>

                      {/* jumlah stok */}
                      <td
                        className={cn(
                          "font-medium",
                          dataUpdate?.id === item.id &&
                            dataUpdate.isActive === "jumlahStok" &&
                            "w-50",
                        )}
                      >
                        {dataUpdate?.id === item.id &&
                        dataUpdate.isActive === "jumlahStok" ? (
                          <CardForm<UpdateBarangMasukDetailType>
                            handleResetForm={handleClearDataUpdate}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            isPending={isPendingUpdate}
                            btnAksiPosition="top"
                            isDirty={isDirty}
                          >
                            {/* input text */}
                            <div className="w-20">
                              <InputNumber<UpdateBarangMasukDetailType>
                                controller={jumlahStokController}
                                placeholder="Masukkan Jumlah Item"
                                required
                                xs
                              />
                            </div>
                          </CardForm>
                        ) : (
                          <div className="flex flex-row justify-start items-start gap-2">
                            <span>{formatNumber(item.jumlahStok)}</span>

                            {/* button update */}
                            {(isRejectedKasir ||
                              isDrafOwner ||
                              dataBarangMasukDetail?.data?.status ===
                                STATUS_INVENTORI_TYPE.DRAFT) && (
                              <ButtonInline
                                handleKeyUpdate={() =>
                                  handleSetDataUpdate({
                                    data: {
                                      id: item.id,
                                      jumlahStok: item.jumlahStok,
                                      produkId: item.produk.id,
                                    },
                                  })
                                }
                              />
                            )}
                          </div>
                        )}
                      </td>

                      {/* total */}
                      {roleOwner && (
                        <td className="font-medium">
                          {formatRupiah(
                            item.produk.hargaBeli * item.jumlahStok,
                          )}
                        </td>
                      )}

                      {/* detail */}
                      {(isRejectedKasir ||
                        isDrafOwner ||
                        dataBarangMasukDetail?.data?.status ===
                          STATUS_INVENTORI_TYPE.DRAFT) && (
                        <td>
                          <div className="flex flex-row justify-start items-center gap-2">
                            <ButtonUpdateTable
                              handleShowModalFormulir={() =>
                                handleShowModalUbahProduk(item.id, {
                                  produk: item.produk,
                                  jumlahBox: item.jumlahBox,
                                  hargaBeli: item.produk.hargaBeli,
                                })
                              }
                              customDataTip="ganti produk"
                            />
                            <ButtonDeleteTable
                              handleShowModalDelete={() =>
                                handleShowModalDelete(item.id, {
                                  nama: item.produk.nama,
                                })
                              }
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td colSpan={11}>
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
      <ModalUbahProdukMasuk
        fromPengajuanBarang={fromPengajuanBarang}
        modalRef={modalUbahProdukRef}
        handleCloseModal={handleCloseModalUbahProduk}
        idBarangMasuk={idBarangMasuk}
        status={dataBarangMasukDetail?.data?.status}
        dataUpdate={{
          jumlahBox: dataUpdateBarangMasuk?.jumlahBox ?? 0,
          produk: dataUpdateBarangMasuk?.produk,
          hargaBeli: dataUpdateBarangMasuk?.hargaBeli ?? 0,
        }}
      />
    </>
  );
};

export default ShowDataBarangMasuk;
