import { Fragment, type FC } from "react";
import type { ResponseStockOpnameType } from "../../../../models/stockOpname.model";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import StatusStockOpname from "../../../../components/ui/StatusStockOpname";
import ButtonDetailTable from "../../../../components/ui/button/ButtonDetailTable";
import DataEmpty from "../../../../components/messages/DataEmpty";
import { ArrowRight, ClipboardCheck, Trash2 } from "lucide-react";
import LoadingFetch from "../../../../components/ui/LoadingFetch";
import { STATUS_STOCK_OPNAME_TYPE } from "../../../../types/constant.type";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";

type Props = {
  data?: ResponseStockOpnameType[] | null;
  isLoading?: boolean;
  handleRedirectDetail: (id: number) => void;
};

const StockOpnameRegular: FC<Props> = ({
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
      {/* ============================================================
       * DESKTOP
       * ============================================================ */}
      <div className="overflow-x-auto w-full bg-base-100 rounded-xl shadow-sm border border-transparent dark:border-base-content/10 mt-2.5 hidden md:flex">
        <table className="w-full table table-xs mb-2 table-zebra">
          {/* HEAD */}
          <thead>
            <tr className="h-12 bg-base-200 text-[0.7rem]">
              <th>No</th>
              <th>Kode Referensi</th>
              <th>Tanggal Opname</th>
              <th>Keterangan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={6}>
                    <div className="skeleton h-12 w-full py-1" />
                  </td>
                </tr>
              ))
            ) : isExistData ? (
              data?.map((stockOpname, index) => (
                <Fragment key={stockOpname.id}>
                  {/* HEADER SETIAP 25 DATA */}
                  {index > 0 && index % 25 === 0 && (
                    <tr className="h-12 bg-base-200 text-[0.7rem] text-base-content/60">
                      <th>No</th>
                      <th>Kode Referensi</th>
                      <th>Tanggal Opname</th>
                      <th>Keterangan</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  )}

                  <tr className="transition-all duration-75 ease-in-out h-18 text-[0.7rem] text-base-content">
                    {/* NOMOR */}
                    <td>{index + 1}</td>

                    {/* KODE REFERENSI */}
                    <td className="font-medium text-info">
                      {stockOpname.kodeReferensi}
                    </td>

                    {/* TANGGAL OPNAME */}
                    <td>
                      {formatTanggalLengkap(stockOpname.tanggalOpname)} WIB
                    </td>

                    {/* KETERANGAN */}
                    <td>
                      {stockOpname.keterangan ? (
                        <span>{stockOpname.keterangan}</span>
                      ) : (
                        <span className="italic text-base-content/50">
                          Tidak ada keterangan
                        </span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td>
                      <StatusStockOpname status={stockOpname.status} />
                    </td>

                    {/* AKSI */}
                    <td>
                      <div className="flex flex-row justify-start items-center gap-2">
                        <ButtonDetailTable
                          handleRedirect={() => {
                            handleRedirectDetail(stockOpname.id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="w-full min-h-60 flex flex-col justify-center items-center">
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

/**
 * ============================================================
 * CARD STOCK OPNAME
 * ============================================================
 */

type CardStockOpnameProps = {
  stockOpname: ResponseStockOpnameType;
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

      {/* ========================================================
       * KETERANGAN
       * ======================================================== */}
      <div className="w-full flex flex-col justify-start items-start gap-1 border-b border-base-content/10">
        <span className="text-[0.65rem] uppercase tracking-wide text-base-content/50">
          Keterangan
        </span>

        {stockOpname.keterangan ? (
          <p className="text-xs text-base-content leading-relaxed">
            {stockOpname.keterangan}
          </p>
        ) : (
          <p className="text-xs italic text-base-content/50">
            Tidak ada keterangan
          </p>
        )}
      </div>

      {/* ========================================================
       * FOOTER
       * ======================================================== */}
      <div className="w-full flex flex-row justify-end items-center gap-2.5 mt-2.5">
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

export default StockOpnameRegular;
