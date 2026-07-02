import { useToastAnimation } from "../../../hooks/useToast";
import useIsModeKasirStore from "../../../stores/iseModaKasirStore";

const useKeranjang = () => {
  // toast
  const { toast } = useToastAnimation();

  // get is mode kasir from store
  const isModeKasir = useIsModeKasirStore((state) => state.isModeKasir);

  return {
    toast,
    isModeKasir,
  };
};

export default useKeranjang;
