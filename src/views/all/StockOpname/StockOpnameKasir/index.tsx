import type { FC } from "react";
import type { ResponseStockOpnameType } from "../../../../models/stockOpname.model";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import StatusStockOpname from "../../../../components/ui/StatusStockOpname";
import ButtonDetailTable from "../../../../components/ui/button/ButtonDetailTable";
import DataEmpty from "../../../../components/messages/DataEmpty";

type Props = {
  data?: ResponseStockOpnameType[] | null;
  isLoading?: boolean;
};

const StockOpnameKasir: FC<Props> = ({ data, isLoading }) => {
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
            <th>Admin Opname</th>
            <th>Keterangan</th>
            <th>Status</th>
            <th>Diverifikasi Oleh</th>
            <th>Waktu Verifikasi</th>
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
                      @{stockOpname.adminOpname.username}
                    </span>
                  </div>
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

                {/* VERIFIED BY */}
                <td>
                  {stockOpname.verifiedBy ? (
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {stockOpname.verifiedBy.nama}
                      </span>

                      <span className="text-base-content/50">
                        @{stockOpname.verifiedBy.username}
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
  );
};

export default StockOpnameKasir;
