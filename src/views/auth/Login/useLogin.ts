import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginType } from "../../../models/auth.model";
import { AuthValidations } from "../../../validations/auth.validation";
import { useMutation } from "@tanstack/react-query";
import { AuthServices } from "../../../services/auth.service";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";

const useLogin = () => {
  // use form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginType>({
    resolver: zodResolver(AuthValidations.LOGIN),
  });

  //   use mutation
  const { mutateAsync: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: (req: LoginType) => AuthServices.login(req),
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (err) => {
      // check response
      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (err.response?.data?.meta.statusCode === 400) {
          setError("identifier", {
            message: "Username atau Password tidak valid",
          });
          setError("password", {
            message: "Username atau Password tidak valid",
          });
        }
      }

      //   chekc
      console.log(err);
    },
  });

  //   handle submit
  const onSubmit = async (data: LoginType) => {
    try {
      // hit
      await mutateLogin(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPendingLogin,
  };
};

export default useLogin;
