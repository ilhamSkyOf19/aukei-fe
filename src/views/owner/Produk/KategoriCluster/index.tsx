import type { FC } from "react";
import FormulirTambahData from "./FormulirTambahData";
import ShowData from "./ShowData";

type Props = {
  handleSetToast: (toast: string) => void;
  handleSetAlert: (alert: string) => void;
};
const KategoriCluster: FC<Props> = ({ handleSetAlert, handleSetToast }) => {
  return (
    <div className="w-full flex flex-col justify-start items-start">
      {/* content */}
      <div className="w-full flex flex-row gap-2.5 justify-center items-start">
        {/* formulir tambah kategori */}
        <FormulirTambahData handleSetToast={handleSetToast} />

        {/* show data */}
        <ShowData
          handleSetAlert={handleSetAlert}
          handleSetToast={handleSetToast}
        />
      </div>
    </div>
  );
};

export default KategoriCluster;
