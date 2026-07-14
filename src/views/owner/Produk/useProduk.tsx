import { useEffect, useState } from "react";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { useFilter } from "../../../hooks/useFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProdukServices } from "../../../services/produk.service";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useToastAnimation } from "../../../hooks/useToast";
import useModal from "../../../hooks/useModal";
import useDeleteProduk from "../../../hooks/useDeleteProduk";

const useProduk = () => {
  // current pathname
  const currentPathname = useLocation().pathname;

  // search params
  const [_searchParams, setSearchParams] = useSearchParams();

  // query client
  const queryClient = useQueryClient();

  // use modal delete
  const {
    modalRef: modalDeleteRef,
    handleShowModal: handleShowModalDelete,
    handleCloseModal: handleCloseModalDelete,
    idModal: idModalDelete,
    dataModal: dataDeleteProduk,
  } = useModal<{ nama: string }>();

  // use modal failed delete
  const {
    modalRef: modalFailedDeleteRef,
    handleShowModal: showModalFailedDelete,
    handleCloseModal: handleCloseModalFailedDelete,
    dataModal: dataModalFailedDelete,
  } = useModal<{ titleMessage: string; description: string }>();

  // handle modal failed delete
  const handleShowModalFailedDelete = () => {
    showModalFailedDelete(undefined, {
      titleMessage: `Produk "${dataDeleteProduk?.nama}" tidak dapat dihapus`,
      description:
        "Produk masih digunakan oleh data lain. Nonaktifkan produk jika tidak lagi digunakan.",
    });
  };

  // use delete
  const { handleDeleteProduk, isPendingDeleteProduk } = useDeleteProduk({
    handleShowModalFailedDelete,
    validatedIdParams: idModalDelete || null,
    handleCloseModal: handleCloseModalDelete,
    redirectPathname: currentPathname,
    handleInvalidate: () =>
      queryClient.invalidateQueries({ queryKey: ["produk"] }),
  });

  // navigate
  const navigate = useNavigate();

  // toast
  const { toast, handleSetToast } = useToastAnimation();

  //   is active Cluster inventori
  const [isActiveCluster, setIsActiveCluster] = useState<
    "produk" | "kategori" | "spesifikasi" | ""
  >("");

  // handle is active
  const handleActiveCluster = (
    Cluster: "produk" | "kategori" | "spesifikasi" | "",
  ) => {
    // set state
    setIsActiveCluster(Cluster);

    // clear params
    setSearchParams({});

    //  set localstorage
    localStorage.setItem("active-cluster", Cluster);
  };

  useEffect(() => {
    // get localstorage
    const datalocalStorage = localStorage.getItem("active-cluster");

    // check
    if (datalocalStorage) {
      setIsActiveCluster(
        datalocalStorage as "produk" | "kategori" | "spesifikasi",
      );
    } else {
      setIsActiveCluster("produk");
    }
  }, []);

  // search filter
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // sort filter
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
    defaultValueCustom: "asc",
  });

  // kategori filter
  const { filter: kategori, setFilter: handleKategori } = useFilter({
    paramName: "kategori",
  });

  // page filter
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // limit filter
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // use query
  const { data: dataProduk, isLoading: isLoadingProduk } = useQuery({
    queryKey: ["produk", { search, sort, kategori, limit, page }],
    queryFn: () =>
      ProdukServices.findAll({
        ...(search && { search }),
        ...(sort && { sort }),
        ...(kategori && { kategori }),
        ...(limit && { limit }),
        ...(page && { page }),
      }),
    refetchOnWindowFocus: false,
    retry: false,
  });

  // is exist data
  const isExistDataProduk: boolean =
    !isLoadingProduk && dataProduk?.data?.data
      ? dataProduk?.data?.data?.length > 0
        ? true
        : false
      : false;

  // handle redirect detail
  const handleRedirectDetail = (id: number) => {
    navigate(`${currentPathname}/${id}`);
  };

  // handle redirect tambah
  const handleRedirectTambah = () => {
    navigate(`${currentPathname}/tambah`);
  };

  // update is active
  const {
    mutateAsync: mutateUpdateIsActive,
    isPending: isPendingUpdateIsActive,
    variables: variablesUpdateIsActive,
  } = useMutation({
    mutationFn: (data: { id: number; status: boolean }) =>
      ProdukServices.updateStatus({
        id: data.id,
        status: data.status,
      }),
    onSuccess: () => {
      handleSetToast("updated_status");

      // invalidate
      queryClient.invalidateQueries({ queryKey: ["produk"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // handle update is active
  const handelUpdateIsActive = async (data: {
    id: number;
    status: boolean;
  }) => {
    try {
      await mutateUpdateIsActive(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleRedirectDetail,
    handleRedirectTambah,
    isActiveCluster,
    handleActiveCluster,
    handleSearch,
    handleSort,
    handleKategori,
    handleLimit,
    handlePage,
    dataProduk,
    isLoadingProduk,
    isExistDataProduk,
    toast,
    handleShowModalDelete,
    modalDeleteRef,
    isPendingDeleteProduk,
    handleDeleteProduk,
    dataDeleteProduk,
    handleCloseModalDelete,
    kategori,
    sort,
    handelUpdateIsActive,
    variablesUpdateIsActive,
    isPendingUpdateIsActive,
    modalFailedDeleteRef,
    handleCloseModalFailedDelete,
    dataModalFailedDelete,
  };
};

export default useProduk;
