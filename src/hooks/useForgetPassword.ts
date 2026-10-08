import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ActivationCodeValidation } from "../validations/activationCode.validation";
import { ActivationCodeService } from "../services/activationCode.service";
import type { ActivationLocalStorageType } from "../models/activationCode.model";
import type { ErrorResponse } from "../types/response.type";

const useForgetPassword = () => {
  // Navigate
  const navigate = useNavigate();

  // Form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<{ email: string }>({
    resolver: zodResolver(ActivationCodeValidation.CREATE),
  });

  // Mutation untuk mengirim kode aktivasi ke email
  const { mutateAsync: mutateSendCode, isPending: isPendingSendCode } =
    useMutation({
      mutationFn: (data: { email: string }) =>
        ActivationCodeService.sendCode(data.email),
      onSuccess: (data) => {
        // Reset form setelah berhasil
        reset();

        if (data) {
          // Simpan email & waktu kadaluarsa ke localStorage
          const activation: ActivationLocalStorageType = {
            email: data.data?.pengguna.email ?? "",
            expiredAt: data.data?.expiredAt ?? new Date(),
          };
          localStorage.setItem("activation", JSON.stringify(activation));
        }

        // Navigate ke halaman activation code
        navigate("/activation-code");
      },
      onError: (error) => {
        // Cek error dari axios
        if (axios.isAxiosError<ErrorResponse>(error)) {
          if (error?.response?.data?.meta?.statusCode === 400) {
            // Email tidak ditemukan
            if (error?.response?.data?.meta?.customField?.includes("email")) {
              setError("email", {
                message: "Email tidak ditemukan",
              });
            }

            // Kode aktivasi sebelumnya masih berlaku (belum expired)
            if (
              error?.response?.data?.meta?.customField?.includes("not-expired")
            ) {
              setError("email", {
                message:
                  "Kode aktivasi sudah dikirim, tunggu beberapa saat lagi",
              });
            }

            return;
          }
        }
      },
    });

  // Handler submit form
  const onSubmit = async (data: { email: string }) => {
    try {
      await mutateSendCode(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPendingSendCode,
  };
};

export default useForgetPassword;
