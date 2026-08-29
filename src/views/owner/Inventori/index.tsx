import ButtonCluster from "../../../components/ui/button/ButtonCluster";
import BarangKeluar from "./BarangKeluar";
import BarangMasuk from "./BarangMasuk";
import PengajuanBarangKeluar from "./PengajuanBarangKeluar";
import PengajuanBarangMasuk from "./PengajuanBarangMasuk";
import useInventori from "./useInventori";

const Inventori = () => {
  // use inventori
  const { handleActiveCluster, activeCluster } = useInventori();

  return (
    <main className="w-full flex flex-col justify-start">
      {/* button cluster */}
      <div className="w-full flex flex-row justify-center fixed md:sticky p-2 top-14 z-8 backdrop-blur-2xl shrink-0">
        <div className="w-full flex flex-row justify-start items-center bg-base-100 shadow-sm h-16 md:h-14 p-2 gap-2 dark:border dark:border-base-content/10 rounded-2xl md:rounded-xl overflow-x-auto">
          {/* barang masuk */}
          <ButtonCluster
            isActive={activeCluster === "barangMasuk"}
            label="Barang Masuk"
            handleActive={() => handleActiveCluster("barangMasuk")}
          />
          {/* pengajuan barang masuk */}
          <ButtonCluster
            isActive={activeCluster === "pengajuanBarangMasuk"}
            label="Pengajuan Barang Masuk"
            handleActive={() => handleActiveCluster("pengajuanBarangMasuk")}
            customWidth="w-50"
          />

          {/* barang keluar */}
          <ButtonCluster
            isActive={activeCluster === "barangKeluar"}
            label="Barang Keluar"
            handleActive={() => handleActiveCluster("barangKeluar")}
          />

          {/* pengajuan barang keluar */}
          <ButtonCluster
            isActive={activeCluster === "pengajuanBarangKeluar"}
            label="Pengajuan Barang Keluar"
            handleActive={() => handleActiveCluster("pengajuanBarangKeluar")}
            customWidth="w-50"
          />
        </div>
      </div>

      {/* content */}
      <div className="w-full flex justify-center items-start pt-18 md:pt-0">
        {/* show data barang masuk */}
        {activeCluster === "barangMasuk" && <BarangMasuk />}
        {/* show data pengajuan barang masuk  */}
        {activeCluster === "pengajuanBarangMasuk" && <PengajuanBarangMasuk />}
        {/* show data barang keluar */}
        {activeCluster === "barangKeluar" && <BarangKeluar />}

        {/* show data pengajuan barang masuk  */}
        {activeCluster === "pengajuanBarangKeluar" && <PengajuanBarangKeluar />}
      </div>
    </main>
  );
};

export default Inventori;
