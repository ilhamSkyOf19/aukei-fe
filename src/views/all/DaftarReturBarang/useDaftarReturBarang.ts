import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToastAnimation } from "../../../hooks/useToast";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { useFilter } from "../../../hooks/useFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseId } from "../../../helpers/helpers";
import { ReturBarangServices } from "../../../services/returBarang.service";
import { useAuthStore } from "../../../stores/authStore";
import useModal from "../../../hooks/useModal";

const useDaftarReturBarang = () => {
  const navigate = useNavigate();

  // get current pathname
  const currentPathname = useLocation().pathname;

  // get pengguna
  const pengguna = useAuthStore((state) => state.pengguna);

  // query client
  const queryClient = useQueryClient();

  // handle toast
  const { toast, handleSetToast } = useToastAnimation();

  // get transaction id from params
  const { transactionId } = useParams<{ transactionId: string }>();

  // parse id
  const validatedTransactionId = parseId(transactionId);

  // filter search
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // filter page
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // filter sort
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
    defaultValueCustom: "desc",
  });

  // filter limit
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // use modal delete
  const {
    modalRef: modalDeleteRef,
    handleShowModal: handleShowModalDelete,
    handleCloseModal: handleCloseModalDelete,
    idModal: idModalDelete,
    dataModal: dataDelete,
  } = useModal<{ kodeReferensi?: string }>();

  // filter status
  const { filter: status, setFilter: handleStatus } = useFilter({
    paramName: "status",
    allowQuery: ["approved", "pending", "rejected", "semua"],
    defaultValueCustom: "semua",
    resetPage: true,
  });

  // use query
  const { data: daftarReturBarang, isLoading: isLoadingReturBarang } = useQuery(
    {
      queryKey: [
        "daftar-retur-barang",
        page,
        sort,
        limit,
        status,
        search,
        validatedTransactionId,
      ],
      queryFn: () =>
        ReturBarangServices.findAll({
          transactionId: validatedTransactionId!,
          query: {
            ...(page && { page }),
            ...(limit && { limit }),
            ...(sort && { sort }),
            ...(status && { status }),
            ...(search && { search }),
          },
        }),
      enabled: !!validatedTransactionId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  // is existing
  const isExistingDaftarReturBarang: boolean =
    !!daftarReturBarang && !!daftarReturBarang?.data?.data?.length;

  const handleBack = () => {
    return navigate(currentPathname.split("/").slice(0, -1).join("/"));
  };

  // handle redirect detail
  const handleRedirectDetail = (id: number) => {
    return navigate(`${currentPathname}/detail/${id}`);
  };

  // mutate delete
  const { mutateAsync: mutateDelete, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: (id: number) => ReturBarangServices.delete({ id }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["daftar-retur-barang"] });

        handleSetToast("deleted_retur_barang");
      },
      onError: (error: any) => {
        console.log(error);
      },
    },
  );

  // handle delete
  const handleDelete = async () => {
    try {
      await mutateDelete(idModalDelete!);
      return handleCloseModalDelete();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    toast,
    handleBack,
    handleSearch,
    handlePage,
    handleSort,
    sort,
    handleLimit,
    handleStatus,
    status,
    daftarReturBarang,
    isLoadingReturBarang,
    isExistingDaftarReturBarang,
    handleRedirectDetail,
    pengguna,

    // delete
    modalDeleteRef,
    handleShowModalDelete,
    handleCloseModalDelete,
    handleDelete,
    isPendingDelete,
    dataDelete,
  };
};

export default useDaftarReturBarang;
