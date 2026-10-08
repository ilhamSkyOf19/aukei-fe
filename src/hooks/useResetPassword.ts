import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthValidations } from "../validations/auth.validation";
import { AuthServices } from "../services/auth.service";

const useResetPassword = () => {
  // current pathname

  const navigate = useNavigate();

  // use form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(AuthValidations.UPDATE_PASSWORD),
  });

  //   mutation
  const {
    mutateAsync: handleMutateUpdatePassword,
    isPending: isPendingMutateUpdatePassword,
  } = useMutation({
    mutationFn: (data: { password: string; confirmPassword: string }) => {
      return AuthServices.resetPassword(data);
    },
    onSuccess: () => {
      // reset form
      reset();

      // set toast
      navigate("/login", {
        state: {
          toast: "login_again",
        },
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //   on submit
  const onSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      await handleMutateUpdatePassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPendingMutateUpdatePassword,
    navigate,
  };
};

export default useResetPassword;
