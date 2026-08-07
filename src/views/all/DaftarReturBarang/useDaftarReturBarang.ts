import { useLocation, useNavigate } from "react-router-dom";
import { useToastAnimation } from "../../../hooks/useToast";

const useDaftarReturBarang = () => {
  const navigate = useNavigate();

  // get current pathname
  const currentPathname = useLocation().pathname;

  // handle toast
  const { toast } = useToastAnimation();

  const handleBack = () => {
    return navigate(currentPathname.split("/").slice(0, -1).join("/"));
  };

  return { toast, handleBack };
};

export default useDaftarReturBarang;
