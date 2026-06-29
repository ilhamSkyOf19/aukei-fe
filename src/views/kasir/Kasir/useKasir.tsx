import { useEffect, useState } from "react";
import { useAuthStore } from "../../../stores/authStore";
import { useToastAnimation } from "../../../hooks/useToast";

const useKasir = () => {
  const pengguna = useAuthStore((state) => state.pengguna);

  // handle toast
  const { handleSetToast, toast } = useToastAnimation();

  // state mode kasir
  const [isModeKasir, setIsModeKasir] = useState<boolean>(false);

  // state steps
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    // get local storage steps
    const steps = localStorage.getItem("steps");

    if (steps) {
      setStep(Number(steps));
    }
  }, []);

  // handle steps next
  const handleSteps = (value: number) => {
    setStep(value);
    localStorage.setItem("steps", String(value));
  };

  return {
    step,
    handleSteps,
    pengguna,
    isModeKasir,
    setIsModeKasir,
    handleSetToast,
    toast,
  };
};

export default useKasir;
