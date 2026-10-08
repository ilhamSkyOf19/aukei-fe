import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ActivationCodeService } from "../../../../services/activationCode.service";
import type { ActivationLocalStorageType } from "../../../../models/activationCode.model";

const useResend = () => {
  // State: waktu kadaluarsa kode aktivasi
  const [expiredAt, setExpiredAt] = useState<Date | undefined>(undefined);

  // State: email user yang sedang melakukan aktivasi
  const [email, setEmail] = useState<string | undefined>(undefined);

  // State: status disable tombol resend
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  // Ambil data aktivasi (email & expired_at) dari localStorage saat mount
  useEffect(() => {
    const activation = localStorage.getItem("activation");
    const activationData: ActivationLocalStorageType | null = activation
      ? JSON.parse(activation)
      : null;

    if (activationData) {
      setExpiredAt(activationData?.expiredAt);
      setEmail(activationData?.email);
    }
  }, []);

  // Set tombol resend menjadi enabled (dipanggil dari luar, misal saat timer habis)
  const handleDisable = () => {
    setIsDisabled(false);
  };

  // Mutation untuk request resend kode aktivasi
  const { mutateAsync: mutateResendEmail, isPending: isPendingResendEmail } =
    useMutation({
      mutationFn: (email: string) => {
        return ActivationCodeService.resendCode(email);
      },
      onSuccess: (data) => {
        // Simpan email & expired_at terbaru ke localStorage
        localStorage.setItem(
          "activation",
          JSON.stringify({
            email: data.data?.pengguna.email,
            expired_at: data.data?.expiredAt,
          }),
        );

        // Disable tombol resend setelah berhasil
        setIsDisabled(true);

        // Update state expired_at
        setExpiredAt(data.data?.expiredAt);
      },
      onError: (error) => {
        console.log(error);
      },
    });

  // Handler untuk trigger resend email
  const handleResendEmail = async () => {
    try {
      if (!email) return;
      await mutateResendEmail(email ?? "");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleResendEmail,
    isPendingResendEmail,
    expiredAt,
    email,
    handleDisable,
    isDisabled,
  };
};

export default useResend;
