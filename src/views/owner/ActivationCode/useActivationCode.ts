import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { ActivationCodeValidation } from "../../../validations/activationCode.validation";
import { ActivationCodeService } from "../../../services/activationCode.service";
import type { ActivationLocalStorageType } from "../../../models/activationCode.model";
import type { ErrorResponse } from "../../../types/response.type";
import useSizeWindows from "../../../hooks/useSizeWindows";

const useActivationCode = () => {
  // Navigate
  const navigate = useNavigate();

  //   get use windows size
  const windowSize = useSizeWindows();

  // Ambil email dari data aktivasi yang tersimpan di localStorage
  const activation = localStorage.getItem("activation");
  const activationData: ActivationLocalStorageType | null = activation
    ? JSON.parse(activation)
    : null;
  const email = activationData?.email;

  // Form
  const { handleSubmit, reset, setError, control } = useForm<{
    code: string;
  }>({
    resolver: zodResolver(ActivationCodeValidation.VERIFY),
  });

  // Mutation untuk submit kode aktivasi
  const { mutateAsync: mutateSendCode, isPending: isPendingSendCode } =
    useMutation({
      mutationFn: (data: { email: string; code: number }) =>
        ActivationCodeService.activationCode(data),
      onSuccess: () => {
        // Reset form
        reset();

        // Hapus data aktivasi dari localStorage
        localStorage.removeItem("activation");

        // Navigate ke halaman reset password
        navigate("/reset-password");
      },
      onError: (error) => {
        // Cek error dari axios
        if (axios.isAxiosError<ErrorResponse>(error)) {
          if (error?.response?.data?.meta?.statusCode === 400) {
            // Set error pada field code
            setError("code", {
              message: "Kode aktivasi salah",
            });

            return;
          }
        }
      },
    });

  // Controller untuk field code
  const codeController = useController({
    control,
    name: "code",
  });

  // Handler submit form
  const onSubmit = async (data: { code: string }) => {
    try {
      const code = parseInt(data.code);

      // Cek email tersedia
      if (!email) {
        return;
      }

      // Mutate
      await mutateSendCode({ email: email ?? "", code });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleSubmit,
    onSubmit,
    isPendingSendCode,
    codeController,
    email,
    windowSize,
  };
};

export default useActivationCode;
