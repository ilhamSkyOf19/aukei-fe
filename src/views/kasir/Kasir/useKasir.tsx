import { useToastAnimation } from "../../../hooks/useToast";
import { useAuthStore } from "../../../stores/authStore";
import { useStepStore } from "../../../stores/stepStore";

const useKasir = () => {
  // get kasir
  const kasir = useAuthStore((state) => state.pengguna);

  // handle toast
  const { handleSetToast, toast } = useToastAnimation();

  const { step, setStep: handleSteps } = useStepStore((state) => state);

  return {
    step,
    handleSteps,
    handleSetToast,
    toast,
    kasir,
  };
};

export default useKasir;
