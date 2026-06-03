import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useQuery } from "@tanstack/react-query";
import { ProdukServices } from "../../../services/produk.service";

const useProdukDetail = () => {
  // current pathname
  const currentPathname = useLocation().pathname;

  // navigate
  const navigate = useNavigate();

  //   get id from params
  const { id } = useParams<{ id: string }>();

  // validated id params
  const validatedIdParams = parseId(id);

  // use query
  const { data: dataProduk, isLoading: isLoadingDataProduk } = useQuery({
    queryKey: ["detail-produk", validatedIdParams],
    queryFn: () => ProdukServices.detail({ id: validatedIdParams! }),
    enabled: !!validatedIdParams,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // is exist data
  const isExistData = dataProduk?.data !== null;

  // handle redirect detail
  const handleRedirectDetail = () => {
    navigate(`${currentPathname}/${validatedIdParams}`);
  };

  //   handle back
  const handleRedirectBack = () => {
    navigate(-1);
  };

  return {
    handleRedirectDetail,
    isExistData,
    isLoadingDataProduk,
    dataProduk,
    handleRedirectBack,
  };
};

export default useProdukDetail;
