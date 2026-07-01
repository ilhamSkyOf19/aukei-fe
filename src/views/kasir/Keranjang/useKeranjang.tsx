import { useToastAnimation } from "../../../hooks/useToast";

const useKeranjang = () => {
  // toast
  const { toast } = useToastAnimation();
  return {
    toast,
  };
};

export default useKeranjang;
