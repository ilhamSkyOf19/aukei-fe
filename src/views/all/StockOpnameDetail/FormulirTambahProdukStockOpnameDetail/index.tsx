import { type FC } from "react";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../../utils/cn";
import FormCariProdukInventori from "../../../../components/forms/FormCariProdukInventori";
import CardProdukForAfterChooseInventori from "../../../../components/ui/cards/CardProdukForAfterChooseInventori";
import { ClipboardCheck, PackagePlus } from "lucide-react";
import useFormulirTambahProdukStockOpnameDetail from "./useFormulirTambahProdukStockOpnameDetail";
import type { CreateStockOpnameDetailType } from "../../../../models/stockOpnameDetail.model";
import InputChoose from "../../../../components/inputs/InputChoose";
import InputNumber from "../../../../components/inputs/InputNumber";
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
};
const FormulirTambahBarangMasuk: FC<Props> = ({
  handleSetToast,
  handleSetAlert,
  isGlobalLoading,
  alert,
  role,
}) => {
  const {
    handleShowModalFormulirTambahBarang,
    activeComponentChooseProduk,
    dataProdukForChoose,
    errors,
    handleCloseActiveComponentChooseProduk,
    handleCloseModalFormulirTambahBarang,
    handleDeleteValueProdukId,
    handleSearch,
    handleSetValueProdukId,
    handleShowActiveComponentChooseProduk,
    handleSubmit,
    inputSearchRef,
    isLoadingProdukForChoose,
    isPendingStockOpnameDetail,
    modalFormulirTambahBarangRef,
    onSubmit,
    produkChoose,
    stokFisikController,
    wrapperRef,
    jenisChooseController,
  } = useFormulirTambahProdukStockOpnameDetail({
    handleSetAlert,
    handleSetToast,
  });

  return (
    <div
      className={cn("w-full flex flex-col justify-start items-center gap-2")}
    >
      <div className="w-full flex flex-row justify-between items-center mt-2.5">
        <p className="text-md font-semibold text-base-content">
          Daftar Stok Opname
        </p>

        {/* button add */}
        <ButtonWithIcon
          icon={ClipboardCheck}
          label="Tambah Stok Opname"
          handleBtn={() => handleShowModalFormulirTambahBarang()}
        />
      </div>

      {/* modal formulir barang masuk */}
      <ModalFormulirTambahProdukStockOpname
        modalRef={modalFormulirTambahBarangRef}
        handleCloseModal={handleCloseModalFormulirTambahBarang}
        isOwner={role === ROLE_INTERNAL_TYPE.OWNER}
        handleSetAlert={handleSetAlert}
        handleSetToast={handleSetToast}
      />
    </div>
  );
};

export default FormulirTambahBarangMasuk;
