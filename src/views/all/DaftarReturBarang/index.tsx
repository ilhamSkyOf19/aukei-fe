import useDaftarReturBarang from "./useDaftarReturBarang";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_RETUR_BARANG } from "../../../types/toast.type";
import FilterSort from "../../../components/filters/Sort";
import FilterStatusRetur from "../../../components/filters/FilterStatusRetur";
import InputSearch from "../../../components/inputs/InputSearch";
import { cn } from "../../../utils/cn";
import Avatar from "../../../components/ui/Avatar";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import StatusReturBarang from "../../../components/ui/StatusReturBarang";
import ButtonDetailTable from "../../../components/ui/button/ButtonDetailTable";
import DataEmpty from "../../../components/messages/DataEmpty";
import ButtonDeleteTable from "../../../components/ui/button/ButtonDeleteTable";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";

const DaftarReturBarang = () => {
  const {
    toast,
    handleBack,
    daftarReturBarang,
    handleLimit,
    handlePage,
    handleSearch,
    handleSort,
    handleStatus,
    sort,
    status,
    isExistingDaftarReturBarang,
    isLoadingReturBarang,
    handleRedirectDetail,
  } = useDaftarReturBarang();

  return (
    <div className="w-full">
      <div className="w-full flex flex-col justify-start items-start px-2.5 pt-2.5">
        <ButtonBackText handleClick={() => handleBack()} />

        {/* toast */}
        {toast && (
          <Toast
            toast={toast?.id !== null}
            isAnimationOut={toast?.isAnimationOut || false}
            label={TOAST_CONFIG_RETUR_BARANG[toast.type].message}
            color={TOAST_CONFIG_RETUR_BARANG[toast.type].color}
          />
        )}

        {/* filter */}
        <div className="bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 gap-4 flex flex-row justify-start items-start mt-2.5">
          <div className="w-full md:flex-1 flex flex-col justify-start items-start gap-1.5">
            <InputSearch
              handleSearch={handleSearch}
              placeholder="Cari ..."
              withLabel
            />
          </div>

          <div className="w-full md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-center gap-3 md:gap-4 mt-3 md:mt-0">
            {/* filter status */}
            <FilterStatusRetur
              setStatus={handleStatus}
              customWidth="w-full md:w-40"
              value={status}
            />

            {/* filter sort */}
            <FilterSort
              setSort={handleSort}
              customWidth="w-full md:w-30"
              value={sort}
            />
          </div>
        </div>

        {/* data */}
        <div
          className={cn(
            "w-full flex flex-col justify-start items-start rounded-xl border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm overflow-hidden mt-2.5",
          )}
        >
          <div className="w-full flex flex-col justify-start items-start">
            <div className="overflow-x-auto w-full">
              <table className="table table-xs">
                {/* head */}
                <thead>
                  <tr className="text-[0.625rem] bg-base-content/5 h-10">
                    <th>No</th>
                    <th>Kode Referensi</th>
                    <th>Dibuat</th>
                    <th>Tgl. Retur</th>
                    <th>Diverifikasi</th>
                    <th>Tgl. Verifikasi</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {isLoadingReturBarang ? (
                    Array.from({ length: 4 }, (_, i) => i).map((item) => (
                      <tr key={item} className="h-18">
                        <td colSpan={8}>
                          <div className="w-full skeleton h-12" />
                        </td>
                      </tr>
                    ))
                  ) : daftarReturBarang?.data &&
                    daftarReturBarang?.data?.data.length > 0 ? (
                    <>
                      {daftarReturBarang?.data?.data.map((item, index) => {
                        return (
                          <tr key={item.id} className="h-18 text-base-content">
                            <th className="px-3">{index + 1}</th>
                            <td>
                              <span className="text-info font-medium">
                                {item.kodeReferensi}
                              </span>
                            </td>
                            <td>
                              <div className="w-full flex flex-row justify-start items-center gap-2">
                                {/* avatar */}
                                <Avatar
                                  nama={item.createdBy.nama}
                                  index={item.createdBy.id}
                                  xs
                                />
                                <div className="flex flex-col justify-start items-start">
                                  {/* nama */}
                                  <span className="font-semibold text-[0.625rem]">
                                    {item.createdBy.nama}
                                  </span>
                                  {/* no wa */}
                                  <span className="text-[0.625rem] text-base-content/50 capitalize">
                                    {item.createdBy.role.toLowerCase()}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>{formatTanggalPanjang(item.tanggalReturn)}</td>

                            <td>
                              {item.verifiedBy ? (
                                <div className="w-full flex flex-row justify-start items-center gap-2">
                                  {/* avatar */}
                                  <Avatar
                                    nama={item.verifiedBy.nama}
                                    index={item.verifiedBy.id}
                                    xs
                                  />
                                  <div className="flex flex-col justify-start items-start">
                                    {/* nama */}
                                    <span className="font-semibold text-[0.625rem]">
                                      {item.verifiedBy.nama}
                                    </span>
                                    {/* no wa */}
                                    <span className="text-[0.625rem] text-base-content/50 capitalize">
                                      {item.verifiedBy.role.toLowerCase()}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {item.verifiedAt
                                ? formatTanggalPanjang(item.verifiedAt)
                                : "-"}
                            </td>
                            <td>
                              <StatusReturBarang status={item.status} />
                            </td>
                            <td>
                              <div className="flex flex-row justify-start items-center gap-1.5">
                                {/* button detail */}
                                <ButtonDetailTable
                                  handleRedirect={() =>
                                    handleRedirectDetail(item.id)
                                  }
                                />

                                {/* button delete */}
                                <ButtonDeleteTable
                                  handleShowModalDelete={() => {}}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <DataEmpty
                          xs
                          title="Data Retur Tidak Tersedia"
                          description="Belum ada data yang dapat ditampilkan saat ini"
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* pagination */}
        <PaginationAndLimit
          currentPage={daftarReturBarang?.data?.meta.currentPage ?? 1}
          setPage={handlePage}
          totalPage={daftarReturBarang?.data?.meta?.totalPage ?? 1}
          isLoading={isLoadingReturBarang}
          limit={daftarReturBarang?.data?.meta?.limit ?? 8}
          setLimit={handleLimit}
          emptyData={!isExistingDaftarReturBarang}
        />
      </div>
    </div>
  );
};

export default DaftarReturBarang;
