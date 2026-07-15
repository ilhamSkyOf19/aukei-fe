import ButtonCluster from "../../../components/ui/button/ButtonCluster";
import BarangKeluar from "./BarangKeluar";
import BarangMasuk from "./BarangMasuk";
import PengajuanBarangKeluar from "./PengajuanBarangKeluar";
import PengajuanBarangMasuk from "./PengajuanBarangMasuk";
import useInventori from "./useInventori";

const Inventori = () => {
  // use inventori
  const { handleActiveCluster, isActiveCluster } = useInventori();

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="w-full h-full flex flex-col justify-start items-start">
        {/* button cluster */}
        <div className="w-full flex flex-row justify-start items-center bg-base-100 shadow-sm h-18 md:h-14 p-2 gap-2 dark:border dark:border-base-content/10 sticky top-0 z-20 overflow-x-auto shrink-0">
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
            customWidth="w-50"
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
            customWidth="w-50"
          />
        </div>

        {/* content */}
        <div className="w-full flex justify-center items-start overflow-y-auto h-full">
          {/* show data barang masuk */}
          {isActiveCluster === "barangMasuk" && <BarangMasuk />}
          {/* show data pengajuan barang masuk  */}
          {isActiveCluster === "pengajuanBarangMasuk" && (
            <PengajuanBarangMasuk />
          )}
          {/* show data barang keluar */}
          {isActiveCluster === "barangKeluar" && <BarangKeluar />}

          {/* show data pengajuan barang masuk  */}
          {isActiveCluster === "pengajuanBarangKeluar" && (
            <PengajuanBarangKeluar />
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventori;
