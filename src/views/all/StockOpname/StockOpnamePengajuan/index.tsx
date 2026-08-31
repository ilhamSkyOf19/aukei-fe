import type { FC } from "react";
import {
  formatTanggalLengkap,
  formatTanggalPanjang,
} from "../../../../helpers/formatDate";
import StatusStockOpname from "../../../../components/ui/StatusStockOpname";
import ButtonDetailTable from "../../../../components/ui/button/ButtonDetailTable";
import DataEmpty from "../../../../components/messages/DataEmpty";
import type { ResponsePengajuanStockOpnameType } from "../../../../models/pengajuanStockOpname.model";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { ArrowRight, ClipboardCheck, Trash2 } from "lucide-react";
import { STATUS_STOCK_OPNAME_TYPE } from "../../../../types/constant.type";
import LoadingFetch from "../../../../components/ui/LoadingFetch";

type Props = {
  data?: ResponsePengajuanStockOpnameType[] | null;
  isLoading?: boolean;
  handleRedirectDetail: (id: number) => void;
};

const StockOpnamePengajuan: FC<Props> = ({
  data,
  isLoading,
  handleRedirectDetail,
}) => {
  const isExistData = Boolean(data && data.length > 0);

  return (
    <>
      {/* ============================================================
       * MOBILE
       * ============================================================ */}
      <div className="w-full flex md:hidden flex-col justify-start items-start gap-2.5 mt-2.5">
        {isLoading ? (
          <LoadingFetch />
        ) : isExistData ? (
          data?.map((stockOpname) => (
            <CardStockOpname
              key={stockOpname.id}
              stockOpname={stockOpname}
              handleRedirectDetail={handleRedirectDetail}
            />
          ))
        ) : (
          <div className="w-full min-h-60 flex flex-col justify-center items-center">
            <DataEmpty
              title="Data Stock Opname Tidak Tersedia"
              description="Belum ada data stock opname yang dapat ditampilkan saat ini."
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto w-full bg-base-100 rounded-xl shadow-sm border border-transparent dark:border-base-content/10 mt-2.5 hidden md:flex">
        <table className="w-full table table-xs mb-2 table-zebra">
          {/* HEAD */}
          <thead>
            <tr className="h-12 bg-base-200 text-[0.7rem]">
              <th>No</th>
              <th>Kode Referensi</th>
              <th>Tanggal Opname</th>
              <th>Diajukan Oleh</th>
              <th>Status</th>
              <th>Diverifikasi Oleh</th>
              <th>Tanggal Verifikasi</th>
              <th>Aksi</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={9}>
                    <div className="skeleton h-12 w-full py-1" />
                  </td>
                </tr>
              ))
            ) : isExistData ? (
              data?.map((stockOpname, index) => (
                <tr
                  key={stockOpname.id}
                  className="transition-all duration-75 ease-in-out h-18 text-[0.7rem] text-base-content"
                >
                  {/* NOMOR */}
                  <td>{index + 1}</td>

                  {/* KODE REFERENSI */}
                  <td className="font-medium text-info">
                    {stockOpname.kodeReferensi}
                  </td>

                  {/* TANGGAL OPNAME */}
                  <td>{formatTanggalLengkap(stockOpname.tanggalOpname)} WIB</td>

                  {/* ADMIN OPNAME */}
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {stockOpname.adminOpname.nama}
                      </span>

                      <span className="text-base-content/50">
                        {stockOpname.adminOpname.username}
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td>
                    <StatusStockOpname status={stockOpname.status} />
                  </td>

                  {/* VERIFIED BY */}
                  <td>
                    {stockOpname.verifiedBy ? (
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {stockOpname.verifiedBy.nama}
                        </span>

                        <span className="text-base-content/50">
                          {stockOpname.verifiedBy.username}
                        </span>
                      </div>
                    ) : (
                      <span className="italic text-base-content/50">
                        Belum diverifikasi
                      </span>
                    )}
                  </td>

                  {/* VERIFIED AT */}
                  <td>
                    {stockOpname.verifiedAt ? (
                      `${formatTanggalLengkap(stockOpname.verifiedAt)} WIB`
                    ) : (
                      <span className="italic text-base-content/50">-</span>
                    )}
                  </td>

                  {/* AKSI */}
                  <td>
                    <div className="flex flex-row justify-start items-center gap-2">
                      <ButtonDetailTable
                        handleRedirect={() => {
                          // handle redirect detail
                          handleRedirectDetail(stockOpname.id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9}>
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <DataEmpty
                      title="Data Stock Opname Tidak Tersedia"
                      description="Belum ada data stock opname yang dapat ditampilkan saat ini."
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

type CardStockOpnameProps = {
  stockOpname: ResponsePengajuanStockOpnameType;
  handleRedirectDetail: (id: number) => void;
};

const CardStockOpname: FC<CardStockOpnameProps> = ({
  stockOpname,
  handleRedirectDetail,
}) => {
  return (
    <div className="w-full bg-base-100 rounded-2xl flex flex-col justify-start items-start p-4 border border-transparent dark:border-base-content/10 gap-3">
      {/* ========================================================
       * HEADER
       * ======================================================== */}
      <div className="w-full flex flex-row justify-between items-start pb-3 border-b border-base-content/10">
        {/* ICON + INFORMASI */}
        <div className="flex flex-row justify-start items-start gap-3">
          {/* ICON */}
          <div className="w-12 h-12 flex justify-center items-center bg-primary/10 rounded-2xl">
            <ClipboardCheck className="size-5 text-primary" />
          </div>

          {/* INFORMASI */}
          <div className="flex flex-col justify-start items-start gap-1">
            {/* KODE REFERENSI */}
            <span className="text-xs text-info font-medium">
              {stockOpname.kodeReferensi}
            </span>

            {/* TANGGAL */}
            <span className="text-[0.7rem] font-medium text-base-content">
              {formatTanggalLengkap(stockOpname.tanggalOpname)} WIB
            </span>
          </div>
        </div>

        {/* DETAIL */}
        <div className="flex flex-row justify-end items-start">
          <StatusStockOpname status={stockOpname.status} />
        </div>
      </div>

      <div className="w-full flex flex-row justify-between items-start flex-wrap gap-8 border-b border-base-content/10 pb-4">
        {/* label */}
        <div className="flex flex-col justify-start items-start gap-0.5">
          {/* label */}
          <p className="text-[0.7rem] text-base-content ">Diajukan</p>
          <p className="text-xs text-base-content font-semibold">
            {stockOpname.adminOpname.nama}
          </p>
        </div>

        {/* label */}
        <div className="flex flex-col justify-start items-start gap-0.5">
          {/* label */}
          <p className="text-[0.7rem] text-base-content ">Diverifikasi</p>
          <p className="text-xs text-base-content font-semibold">
            {stockOpname.verifiedBy ? stockOpname.verifiedBy.nama : "-"}
          </p>
        </div>

        {/* label */}
        <div className="flex flex-col justify-start items-start gap-0.5">
          {/* label */}
          <p className="text-[0.7rem] text-base-content ">Tgl. Verifikasi</p>
          <p className="text-xs text-base-content font-semibold">
            {stockOpname.verifiedAt
              ? formatTanggalPanjang(stockOpname.verifiedAt)
              : "-"}
          </p>
        </div>
      </div>

      {/* ========================================================
       * FOOTER
       * ======================================================== */}
      <div className="w-full flex flex-row justify-end items-center gap-2.5">
        {(stockOpname.status === STATUS_STOCK_OPNAME_TYPE.DRAFT ||
          stockOpname.status === STATUS_STOCK_OPNAME_TYPE.REJECTED) && (
          <ButtonWithIcon
            customHeight="h-8"
            icon={Trash2}
            label="Hapus"
            bgColor="bg-error"
            textColor="text-primary-white"
            // handleBtn={handleShowModalDelete}
          />
        )}
        <ButtonWithIcon
          customHeight="h-8"
          icon={ArrowRight}
          label="Detail"
          handleBtn={() => handleRedirectDetail(stockOpname.id)}
          reverse
        />
      </div>
    </div>
  );
};

export default StockOpnamePengajuan;
