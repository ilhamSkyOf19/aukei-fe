import { Fragment, type FC } from "react";

import DataEmpty from "../../../../components/messages/DataEmpty";

import LoadingFetch from "../../../../components/ui/LoadingFetch";

import ModalDelete from "../../../../components/modals/ModalDelete";

import CardForm from "../../../../components/inputs/CardForm";

import InputNumber from "../../../../components/inputs/InputNumber";

import ButtonInline from "../../../../components/ui/button/ButtonInline";

import ButtonDeleteTable from "../../../../components/ui/button/ButtonDeleteTable";

import {
  JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE,
  ROLE_INTERNAL_TYPE,
  STATUS_STOCK_OPNAME_TYPE,
  type RoleInternalType,
} from "../../../../types/constant.type";

import type { ResponseStockOpnameWithDetailType } from "../../../../models/stockOpname.model";

import type { UpdateStockOpnameDetailType } from "../../../../models/stockOpnameDetail.model";

import { formatNumber, formatRupiah } from "../../../../helpers/helpers";

import { cn } from "../../../../utils/cn";
import useShowStockOpname from "./useShowStockOpnameDetail";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";

// ============================================================
// TYPE
// ============================================================

type Props = {
  isLoadingStockOpnameDetail?: boolean;

  dataStockOpnameDetail?: ResponseStockOpnameWithDetailType | null;

  isCanUpdate?: boolean;

  handleSetToast: (value: string) => void;
  role?: RoleInternalType;
};

// ============================================================
// COMPONENT
// ============================================================

const ShowStockOpname: FC<Props> = ({
  dataStockOpnameDetail,
  isLoadingStockOpnameDetail,
  isCanUpdate,
  handleSetToast,
  role,
}) => {
  const {
    isActiveAksi,

    modalDeleteRef,
    handleCloseModalDelete,
    handleShowModalDelete,
    handleDelete,
    isPendingDelete,
    dataDelete,

    dataUpdate,
    handleSetDataUpdate,
    handleClearDataUpdate,
    handleSubmit,
    onSubmit,
    isPendingUpdate,
    isDirty,
    stokFisikController,
  } = useShowStockOpname({
    status: dataStockOpnameDetail?.status,
    handleSetToast,
    stockOpnameId: dataStockOpnameDetail?.id,
  });

  // ============================================================
  // EXIST DATA
  // ============================================================

  const isExistData =
    dataStockOpnameDetail && dataStockOpnameDetail.details.length > 0;

  // ============================================================
  // STATUS
  // ============================================================

  const isStatusApproved =
    dataStockOpnameDetail?.status === STATUS_STOCK_OPNAME_TYPE.APPROVED;

  return (
    <>
      {/* ====================================================== */}
      {/* MOBILE */}
      {/* ====================================================== */}

      <div className="w-full flex flex-col justify-start items-center mt-2 gap-3 lg:hidden">
        {isLoadingStockOpnameDetail ? (
          <LoadingFetch />
        ) : isExistData ? (
          dataStockOpnameDetail?.details.map((item) => (
            <div
              key={item.id}
              className="flex flex-col p-3 justify-start items-start w-full rounded-2xl md:rounded-xl bg-base-100 shadow-xs min-h-20 gap-3"
            >
              {/* ================================================== */}
              {/* HEADER */}
              {/* ================================================== */}

              <div className="w-full flex flex-row justify-between items-start pb-3 border-b border-base-content/10">
                <div className="flex flex-row justify-start items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10 lg:h-12 lg:w-12">
                        <img src={item.produk.img} alt="Foto Produk" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-start items-start gap-0.5">
                    <p className="text-base-content text-sm font-semibold">
                      {item.produk.nama}
                    </p>

                    <p className="text-base-content text-xs">
                      {item.produk.kode ? item.produk.kode : "-"}
                    </p>
                  </div>
                </div>

                {/* ACTION */}
                {isCanUpdate && !isStatusApproved && (
                  <div className="flex flex-row justify-end items-center gap-2.5">
                    <ButtonWithIcon
                      bgColor="bg-error"
                      textColor="text-primary-white"
                      label="Hapus"
                      handleBtn={() => handleShowModalDelete(item.id)}
                      customHeight="h-8"
                    />
                  </div>
                )}
              </div>

              {/* ================================================== */}
              {/* DATA */}
              {/* ================================================== */}

              <div className="w-full grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[0.625rem] text-base-content/50">
                    Stok Sistem
                  </span>

                  <span className="text-xs font-semibold">
                    {formatNumber(item.stokSistem)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[0.625rem] text-base-content/50">
                    Stok Fisik
                  </span>

                  <span className="text-xs font-semibold">
                    {item.stokFisik !== null
                      ? formatNumber(item.stokFisik)
                      : "-"}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[0.625rem] text-base-content/50">
                    Selisih
                  </span>

                  <span
                    className={cn(
                      "text-xs font-semibold",
                      item.selisih !== null && item.selisih < 0 && "text-error",
                      item.selisih !== null &&
                        item.selisih > 0 &&
                        "text-success",
                    )}
                  >
                    {item.selisih !== null ? formatNumber(item.selisih) : "-"}
                  </span>
                </div>

                {role === ROLE_INTERNAL_TYPE.OWNER && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[0.625rem] text-base-content/50">
                      Harga Modal
                    </span>

                    <span className="text-xs font-semibold">
                      {item.produk.hargaModalRataRata !== null
                        ? formatRupiah(item.produk.hargaModalRataRata)
                        : "-"}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="text-[0.625rem] text-base-content/50">
                    Total Kerugian
                  </span>

                  <span className="text-xs font-semibold text-error">
                    {formatRupiah(item.totalKerugian)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[0.625rem] text-base-content/50">
                    Penyesuaian
                  </span>

                  <span className="text-xs font-semibold">
                    {item.jenisPenyesuaian ===
                    JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE.MASUK_KERUGIAN
                      ? "Masuk Kerugian"
                      : "Tidak Masuk Kerugian"}
                  </span>
                </div>
              </div>

              {/* KETERANGAN */}
              {item.keteranganPenyesuaian && (
                <div className="w-full pt-3 border-t border-base-content/10">
                  <span className="text-[0.625rem] text-base-content/50">
                    Keterangan
                  </span>

                  <p className="text-xs text-base-content mt-1">
                    {item.keteranganPenyesuaian}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="w-full flex flex-row justify-center items-center py-4 border rounded-2xl md:rounded-xl border-base-content/10">
            <DataEmpty
              title="Data Produk Tidak Tersedia"
              description="Belum ada produk yang ditambahkan ke stok opname."
            />
          </div>
        )}
      </div>

      {/* ====================================================== */}
      {/* DESKTOP */}
      {/* ====================================================== */}

      <div className="w-full hidden lg:flex bg-base-100 dark:border dark:border-base-content/10 flex-col justify-start items-start rounded-2xl md:rounded-xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="table table-xs lg:table-sm table-zebra">
            <thead>
              <tr className="text-xs h-12 text-[0.7rem] bg-base-200">
                <th>No</th>
                <th>Nama Produk</th>
                <th>Stok Sistem</th>
                <th>Stok Fisik</th>
                <th>Selisih</th>
                <th>Penyesuaian</th>
                {role === ROLE_INTERNAL_TYPE.OWNER && <th>Harga Modal</th>}
                <th>Total Kerugian</th>

                {isCanUpdate && !isStatusApproved && <th>Aksi</th>}
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}
              {isLoadingStockOpnameDetail ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={10}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : isExistData ? (
                dataStockOpnameDetail?.details.map((item, index) => (
                  <Fragment key={item.id}>
                    {/* HEADER SETIAP 25 DATA */}
                    {index > 0 && index % 25 === 0 && (
                      <tr className="text-xs h-12 text-[0.7rem] bg-base-200 text-base-content/60">
                        <th>No</th>
                        <th>Nama Produk</th>
                        <th>Stok Sistem</th>
                        <th>Stok Fisik</th>
                        <th>Selisih</th>
                        <th>Penyesuaian</th>
                        {role === ROLE_INTERNAL_TYPE.OWNER && (
                          <th>Harga Modal</th>
                        )}
                        <th>Total Kerugian</th>

                        {isCanUpdate && !isStatusApproved && <th>Aksi</th>}
                      </tr>
                    )}

                    <tr
                      className={cn(
                        "transition-all duration-75 ease-in-out text-base-content text-[0.7rem]",
                        isActiveAksi === item.id && "bg-base-200",
                      )}
                    >
                      {/* NO */}
                      <th>{index + 1}</th>

                      {/* NAMA */}
                      <td>
                        <div className="flex flex-col justify-start items-start">
                          {item.produk.nama}

                          <p className="font-medium">
                            {item.produk.kode ?? "-"}
                          </p>
                        </div>
                      </td>

                      {/* STOK SISTEM */}
                      <td className="font-medium">
                        {formatNumber(item.stokSistem)}
                      </td>

                      {/* STOK FISIK */}
                      <td
                        className={cn(
                          "font-medium",
                          dataUpdate?.id === item.id && "min-w-45",
                        )}
                      >
                        {dataUpdate?.id === item.id ? (
                          <CardForm<UpdateStockOpnameDetailType>
                            handleResetForm={handleClearDataUpdate}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            isPending={isPendingUpdate}
                            btnAksiPosition="top"
                            isDirty={isDirty}
                          >
                            <div className="w-28">
                              <InputNumber<UpdateStockOpnameDetailType>
                                controller={stokFisikController}
                                placeholder="Stok fisik"
                                required
                                xs
                              />
                            </div>
                          </CardForm>
                        ) : (
                          <div className="flex flex-row justify-start items-center gap-2">
                            <span>
                              {item.stokFisik !== null
                                ? formatNumber(item.stokFisik)
                                : "-"}
                            </span>

                            {isCanUpdate && !isStatusApproved && (
                              <>
                                <ButtonInline
                                  handleKeyUpdate={() =>
                                    handleSetDataUpdate({
                                      data: {
                                        id: item.id,
                                        produkId: item.produk.id,
                                        stokFisik: item.stokFisik ?? 0,
                                      },
                                    })
                                  }
                                />
                              </>
                            )}
                          </div>
                        )}
                      </td>

                      {/* SELISIH */}
                      <td
                        className={cn(
                          "font-semibold",
                          item.selisih !== null &&
                            item.selisih < 0 &&
                            "text-error",
                          item.selisih !== null &&
                            item.selisih > 0 &&
                            "text-success",
                        )}
                      >
                        {item.selisih !== null
                          ? formatNumber(item.selisih)
                          : "-"}
                      </td>

                      {/* JENIS PENYESUAIAN */}
                      <td>
                        {item.jenisPenyesuaian
                          ? item.jenisPenyesuaian ===
                            JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE.MASUK_KERUGIAN
                            ? "Masuk Kerugian"
                            : "Tidak Masuk Kerugian"
                          : "-"}
                      </td>

                      {/* HARGA MODAL */}
                      {role === ROLE_INTERNAL_TYPE.OWNER && (
                        <td className="font-medium">
                          {item.hargaModalSatuan !== null
                            ? formatRupiah(item.hargaModalSatuan)
                            : "-"}
                        </td>
                      )}

                      {/* TOTAL KERUGIAN */}
                      <td className="font-medium text-error">
                        {formatRupiah(item.totalKerugian)}
                      </td>

                      {/* AKSI */}
                      {isCanUpdate && !isStatusApproved && (
                        <td>
                          <ButtonDeleteTable
                            handleShowModalDelete={() =>
                              handleShowModalDelete(item.id, {
                                namaProduk: item.produk.nama,
                                kodeProduk: item.produk.kode ?? "-",
                                kodeReferensi:
                                  dataStockOpnameDetail?.kodeReferensi,
                              })
                            }
                          />
                        </td>
                      )}
                    </tr>
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={10}>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <DataEmpty
                        title="Data Produk Tidak Tersedia"
                        description="Belum ada produk yang ditambahkan ke stok opname."
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================== */}
      {/* MODAL DELETE */}
      {/* ====================================================== */}

      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDelete}
        isLoadingDelete={isPendingDelete}
        bigTitle={`Apakah anda yakin ingin menghapus produk "${dataDelete?.namaProduk}" dari stok opname ini?`}
      />
    </>
  );
};

export default ShowStockOpname;
