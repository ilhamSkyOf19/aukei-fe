import { useToastAnimation } from "../../../hooks/useToast";
import useIsModeKasirStore from "../../../stores/iseModaKasirStore";
import { useAuthStore } from "../../../stores/authStore";
import { useStepStore } from "../../../stores/stepStore";

const useKasir = () => {
  // get is mode kasir from store
  const isModeKasir = useIsModeKasirStore((state) => state.isModeKasir);

  // get kasir
  const kasir = useAuthStore((state) => state.pengguna);

  // handle toast
  const { handleSetToast, toast } = useToastAnimation();

  const { step, setStep: handleSteps } = useStepStore((state) => state);

  return {
    step,
    handleSteps,
    isModeKasir,
    handleSetToast,
    toast,
    kasir,
  };
};

export default useKasir;
