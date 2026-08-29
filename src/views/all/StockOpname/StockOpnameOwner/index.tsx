import type { FC } from "react";
import type { ResponseStockOpnameType } from "../../../../models/stockOpname.model";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import StatusStockOpname from "../../../../components/ui/StatusStockOpname";
import ButtonDetailTable from "../../../../components/ui/button/ButtonDetailTable";
import DataEmpty from "../../../../components/messages/DataEmpty";

type Props = {
  data?: ResponseStockOpnameType[] | null;
  isLoading?: boolean;
  handleRedirectDetail: (id: number) => void;
};

const StockOpnameOwner: FC<Props> = ({
  data,
  isLoading,
  handleRedirectDetail,
}) => {
  const isExistData = Boolean(data && data.length > 0);

  return (
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
                        // redirect ke detail stock opname
                        handleRedirectDetail(stockOpname.id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>
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
  );
};

export default StockOpnameOwner;
