import { Trash2 } from "lucide-react";
import InputNumber from "../../../../components/inputs/InputNumber";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { useFormData } from "./useFormData";

type ReturnDetailInputProps = {
  returnTransactionId: number;
  returnDetailId: number;
  transactionId: number;

  hargaBeliRetur: number;
  quantityReturn: number;
  totalRefund: number;

  maxQuantity: number;

  handleSetToast: (value: string) => void;
};

const FormData = ({
  returnTransactionId,
  returnDetailId,
  transactionId,
  hargaBeliRetur: initialHargaBeliRetur,
  quantityReturn: initialQuantityReturn,
  totalRefund: initialTotalRefund,
  maxQuantity,
  handleSetToast,
}: ReturnDetailInputProps) => {
  /**
   * ============================================================
   * SATU-SATUNYA SUMBER FORM STATE
   * ============================================================
   *
   * useFormData sudah menangani semuanya:
   * - setup form (useForm)
   * - watch 3 input
   * - auto update (mutation) setiap 3 detik
   *
   * Dipanggil SEKALI di sini saja.
   */
  const {
    controllerHargaBeli,
    controllerTotalRefund,
    quantityReturnController,
    isPending,
    handleBlur,

    handleDeleteReturnDetail,
    isPendingDeleteReturnDetail,
  } = useFormData({
    returnTransactionId,
    returnDetailId,
    transactionId,
    hargaBeliRetur: initialHargaBeliRetur,
    quantityReturn: initialQuantityReturn,
    totalRefund: initialTotalRefund,
    handleSetToast,
  });

  return (
    <div className="md:col-span-3 lg:col-span-3 flex flex-col justify-start items-start">
      <div className="w-full flex flex-row justify-start items-start gap-2.5">
        {/* =====================================================
          QUANTITY RETURN
          ===================================================== */}
        <div className="flex-3">
          <InputNumber
            label="Qty Return"
            placeholder="Contoh: 5"
            controller={quantityReturnController}
            name="quantityReturn"
            max={maxQuantity}
            disabled={isPending}
            onBlur={handleBlur}
          />
        </div>

        {/* =====================================================
          HARGA BELI RETUR
          ===================================================== */}
        <div className="flex-2">
          <InputNumber
            label="Harga Beli Retur"
            placeholder="Contoh: 50000"
            controller={controllerHargaBeli}
            name="hargaBeliRetur"
            max={undefined}
            disabled={isPending}
            onBlur={handleBlur}
          />
        </div>

        {/* =====================================================
          TOTAL REFUND
          ===================================================== */}
        <div className="flex-2">
          <InputNumber
            label="Total Refund"
            placeholder="Contoh: 100000"
            controller={controllerTotalRefund}
            name="totalRefund"
            max={undefined}
            disabled={isPending}
            onBlur={handleBlur}
          />
        </div>

        {/* aksi */}
        <div className="flex-1 flex flex-row justify-end h-full items-center gap-2.5">
          <div className="flex flex-col justify-start items-start mt-5">
            <ButtonWithIcon
              label="hapus"
              icon={Trash2}
              bgColor="bg-error"
              textColor="text-primary-white"
              isLoading={isPendingDeleteReturnDetail}
              handleBtn={() =>
                handleDeleteReturnDetail({
                  returnDetailId,
                  returnTransactionId,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormData;
