import { type FC } from "react";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../../utils/cn";
import { ClipboardCheck } from "lucide-react";
import useFormulirTambahProdukStockOpnameDetail from "./useFormulirTambahProdukStockOpnameDetail";
import ModalFormulirTambahProdukStockOpname from "../../../../components/modals/ModalFormulirTambahProdukStockOpname";
import type { Alert } from "../../../../types/alert.types";
import {
  ROLE_INTERNAL_TYPE,
  type RoleInternalType,
} from "../../../../types/constant.type";

type Props = {
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
  alert?: Alert | null;
  isGlobalLoading?: boolean;
  role?: RoleInternalType;
  produkChooseIds: number[];
};
const FormulirTambahBarangMasuk: FC<Props> = ({
  handleSetToast,
  handleSetAlert,
  isGlobalLoading,
  role,
  produkChooseIds,
}) => {
  const {
    handleShowModalFormulirTambahBarang,
    handleCloseModalFormulirTambahBarang,
    modalFormulirTambahBarangRef,
  } = useFormulirTambahProdukStockOpnameDetail();

  return (
    <div
      className={cn("w-full flex flex-col justify-start items-center gap-2")}
    >
      <div className="w-full flex flex-row justify-between items-center">
        <p className="text-md font-semibold text-base-content">
          Daftar Stok Opname
        </p>

        {/* button add */}
        {isGlobalLoading ? (
          <div className="skeleton w-30 h-9.5 bg-base-200" />
        ) : (
          <ButtonWithIcon
            icon={ClipboardCheck}
            label="Tambah Stok Opname"
            handleBtn={() => handleShowModalFormulirTambahBarang()}
          />
        )}
      </div>

      {/* modal formulir barang masuk */}
      <ModalFormulirTambahProdukStockOpname
        modalRef={modalFormulirTambahBarangRef}
        handleCloseModal={handleCloseModalFormulirTambahBarang}
        isOwner={role === ROLE_INTERNAL_TYPE.OWNER}
        handleSetAlert={handleSetAlert}
        handleSetToast={handleSetToast}
        produkChooseIds={produkChooseIds}
      />
    </div>
  );
};

export default FormulirTambahBarangMasuk;
