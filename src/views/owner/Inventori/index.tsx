import ButtonCluster from "../../../components/ui/button/ButtonCluster";
import BarangKeluar from "./BarangKeluar";
import BarangMasuk from "./BarangMasuk";
import useInventori from "./useInventori";

const Inventori = () => {
  // use inventori
  const { handleActiveCluster, isActiveCluster } = useInventori();

  return (
    <div className="w-full mb-30 flex flex-col justify-start items-start">
      {/* button cluster */}
      <div className="w-full flex flex-row justify-start items-center bg-base-100 shadow-sm h-14 p-2 gap-2 dark:border dark:border-base-content/10 sticky top-0 z-10 overflow-x-auto">
        {/* barang masuk */}
        <ButtonCluster
          isActive={isActiveCluster === "barangMasuk"}
          label="Barang Masuk"
          handleActive={() => handleActiveCluster("barangMasuk")}
        />
        {/* pengajuan barang masuk */}
        <ButtonCluster
          isActive={isActiveCluster === "pengajuanBarangMasuk"}
          label="Pengajuan Barang Masuk"
          handleActive={() => handleActiveCluster("pengajuanBarangMasuk")}
        />

        {/* barang keluar */}
        <ButtonCluster
          isActive={isActiveCluster === "barangKeluar"}
          label="Barang Keluar"
          handleActive={() => handleActiveCluster("barangKeluar")}
        />

        {/* pengajuan barang keluar */}
        <ButtonCluster
          isActive={isActiveCluster === "pengajuanBarangKeluar"}
          label="Pengajuan Barang Keluar"
          handleActive={() => handleActiveCluster("pengajuanBarangKeluar")}
        />
      </div>

      {/* content */}
      <div className="w-full h-full flex justify-center items-start px-2 lg:px-4 mt-4">
        {/* show data */}
        {isActiveCluster === "barangMasuk" && <BarangMasuk />}
        {/* show data */}
        {isActiveCluster === "barangKeluar" && <BarangKeluar />}
      </div>
    </div>
  );
};

export default Inventori;
