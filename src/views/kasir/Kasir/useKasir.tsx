import { useEffect, useState } from "react";
import { useToastAnimation } from "../../../hooks/useToast";
import useIsModeKasirStore from "../../../stores/iseModaKasirStore";

const useKasir = () => {
  // get is mode kasir from store
  const isModeKasir = useIsModeKasirStore((state) => state.isModeKasir);

  // handle toast
  const { handleSetToast, toast } = useToastAnimation();

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
    isModeKasir,
    handleSetToast,
    toast,
  };
};

export default useKasir;
