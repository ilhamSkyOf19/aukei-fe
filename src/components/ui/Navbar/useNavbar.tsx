import useLogOut from "../../../hooks/useLogOut";

const useNavbar = () => {
  const { handleLogout } = useLogOut({ redirectUrl: true });

  return {
    handleLogout,
  };
};

export default useNavbar;
