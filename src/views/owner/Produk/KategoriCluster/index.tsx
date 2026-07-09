import FormulirTambahData from "./FormulirTambahData";
import ShowData from "./ShowData";

const KategoriCluster = () => {
  return (
    <div className="w-full mb-30 md:mb-60 lg:mb-0 flex flex-col justify-start items-start">
      {/* content */}
      <div className="w-full flex flex-row gap-4 justify-center items-start">
        {/* formulir tambah kategori */}
        <FormulirTambahData />

        {/* show data */}
        <ShowData />
      </div>
    </div>
  );
};

export default KategoriCluster;
