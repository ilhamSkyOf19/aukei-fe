import {
  formatNumber,
  formatNumberK,
  formatRupiah,
  formatRupiahShort,
} from "../../../../helpers/helpers";
import DataEmpty from "../../../../components/messages/DataEmpty";
import type { ResponseStructure } from "../../../../types/response.type";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";
import ModalDelete from "../../../../components/modals/ModalDelete";
import type { UpdateBarangMasukDetailType } from "../../../../models/barangMasukDetail.model";
import CardForm from "../../../../components/inputs/CardForm";
import ButtonInline from "../../../../components/ui/button/ButtonInline";
import type { ResponseBarangKeluarWithDetailType } from "../../../../models/barangKeluar.model";
import useShowBarangKeluar from "./useShowBarangKeluar";
import type { UpdateBarangKeluarDetailType } from "../../../../models/barangKeluarDetail.model";
import ModalUbahProdukKeluar from "../../../../components/modals/ModalUbahProdukKeluar";
import {
  ROLE_INTERNAL_TYPE,
  STATUS_INVENTORI_TYPE,
  type RoleInternalType,
} from "../../../../types/constant.type";
import InputNumber from "../../../../components/inputs/InputNumber";
import ButtonUpdateTable from "../../../../components/ui/button/ButtonUpdateTable";
import ButtonDeleteTable from "../../../../components/ui/button/ButtonDeleteTable";
import LoadingFetch from "../../../../components/ui/LoadingFetch";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";

type Props = {
  isLoadingBarangKeluarDetail?: boolean;
  dataBarangKeluarDetail?: ResponseStructure<ResponseBarangKeluarWithDetailType | null>;
  fromPengajuanBarang?: boolean;
  role?: RoleInternalType;
  handleSetAlert: (data: string) => void;
};
const ShowDataBarangKeluar: FC<Props> = ({
  dataBarangKeluarDetail,
  isLoadingBarangKeluarDetail,
  fromPengajuanBarang,
  role,
  handleSetAlert,
}) => {
  const {
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
    dataUpdateBarangKeluar,
  } = useShowBarangKeluar({
    status: dataBarangKeluarDetail?.data?.status,
    handleSetAlert: handleSetAlert,
  });

  // existing data
  const isExistData =
    dataBarangKeluarDetail?.data &&
    dataBarangKeluarDetail?.data?.detailBarangKeluars?.length > 0
      ? true
      : false;

  // is rejected kasir
  const isRejectedKasir =
    dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.REJECTED &&
    role === ROLE_INTERNAL_TYPE.KASIR;

  // const is draft owner
  const isDrafOwner =
    dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT &&
    role === ROLE_INTERNAL_TYPE.OWNER;

  return (
    <>
      {/* for sm */}
      <div className="w-full flex flex-col justify-start items-center gap-3 lg:hidden">
        {/* data empty */}
        {isLoadingBarangKeluarDetail ? (
          <LoadingFetch />
        ) : isExistData ? (
          dataBarangKeluarDetail?.data?.detailBarangKeluars?.map((item) => (
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

                      <div className="flex flex-row justify-start items-center gap-2">
                        <p className="text-base-content/50 text-[0.7rem] font-medium border-r border-base-content/10 pr-2.5">
                          {item.produk.kode}
                        </p>

                        <p className="text-base-content/50 text-[0.7rem] font-medium">
                          {item.produk.kategori.nama}
                        </p>
                      </div>
                    </div>

                    {/* button aksi */}
                    <div className="flex flex-row justify-end items-start gap-2.5">
                      {!fromPengajuanBarang && !isStatusPosted && (
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
                                produkId: item.produk.id,
                                jumlahStok: item.jumlahStok,
                              })
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* content two */}
              <div className="w-full flex flex-row justify-start items-start gap-2">
                {/* data */}
                <div className="w-full flex flex-row justify-start items-end mt-2 flex-wrap gap-4">
                  {/* harga modal */}
                  <div className="flex-1 flex flex-col justify-start items-start gap-0.5 border-r border-base-content/10">
                    <span className="text-[0.625rem] text-base-content/50">
                      Harga Modal
                    </span>

                    <span className="text-xs font-semibold text-base-content">
                      {formatRupiahShort(item.hargaModalSatuan)}
                    </span>
                  </div>

                  {/* jumlah stok */}
                  <div className="flex-1 flex flex-col justify-start items-start gap-0.5 border-r border-base-content/10">
                    <span className="text-[0.625rem] font-medium text-base-content/50">
                      Jumlah Stok
                    </span>

                    <span className="text-xs font-semibold text-base-content">
                      {formatNumberK(item.jumlahStok)}
                    </span>
                  </div>

                  {/* total nilai */}
                  <div className="flex-1 flex flex-col justify-start items-start gap-0.5">
                    <span className="text-[0.625rem] font-medium text-base-content/50">
                      Total Nilai
                    </span>

                    <span className="text-xs font-semibold text-base-content">
                      {formatRupiahShort(
                        item.jumlahStok * item.hargaModalSatuan,
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
      <div className="w-full hidden lg:flex bg-base-100 dark:border dark:border-base-content/10 flex-col justify-start items-start rounded-2xl md:rounded-xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="table table-xs lg:table-sm">
            {/* head */}
            <thead>
              <tr className="text-[0.7rem] bg-base-200 h-12">
                <th>No</th>
                <th>Foto</th>
                <th>Kode</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Harga Modal</th>
                <th>Stok Saat Ini</th>
                <th>Stok Keluar</th>
                <th>Total</th>
                {(isRejectedKasir ||
                  isDrafOwner ||
                  dataBarangKeluarDetail?.data?.status ===
                    STATUS_INVENTORI_TYPE.DRAFT) && <th>Aksi</th>}
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
                        "transition-all duration-75 ease-in-out text-base-content text-[0.7rem]",
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
                      <td>{item.produk.nama}</td>
                      {/* kategori */}
                      <td>{item.produk.kategori.nama}</td>

                      {/* jumlah perbox */}
                      <td>
                        <span>
                          {formatRupiah(item.hargaModalSatuan.toString())}
                        </span>
                      </td>

                      {/* stok saat ini */}
                      <td className="font-medium">
                        {formatNumber(item.produk.stok)}
                      </td>

                      {/* stok keluar */}
                      <td className="font-medium">
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
                            <span>{formatNumber(item.jumlahStok)}</span>

                            {/* button update */}
                            {(isRejectedKasir ||
                              isDrafOwner ||
                              dataBarangKeluarDetail?.data?.status ===
                                STATUS_INVENTORI_TYPE.DRAFT) && (
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
                      <td className="font-medium">
                        {formatRupiah(item.hargaModalSatuan * item.jumlahStok)}
                      </td>

                      {/* detail */}
                      {(isRejectedKasir ||
                        isDrafOwner ||
                        dataBarangKeluarDetail?.data?.status ===
                          STATUS_INVENTORI_TYPE.DRAFT) && (
                        <td>
                          <div className="flex flex-row justify-start items-center gap-2">
                            <ButtonUpdateTable
                              handleShowModalFormulir={() =>
                                handleShowModalUbahProduk(item.id, {
                                  produkId: item.produk.id,
                                  jumlahStok: item.jumlahStok,
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
          jumlahStok: dataUpdateBarangKeluar?.jumlahStok,
          produkId: dataUpdateBarangKeluar?.produkId,
        }}
      />
    </>
  );
};

export default ShowDataBarangKeluar;
