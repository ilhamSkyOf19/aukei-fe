import instanceAxios from "../libs/axios";
import type { ResponseActivationType } from "../models/activationCode.model";
import type { ResponseStructure } from "../types/response.type";

export class ActivationCodeService {
  // send code
  static async sendCode(
    email: string,
  ): Promise<ResponseStructure<ResponseActivationType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseActivationType | null>
    >(`/activation-code/send-code`, { email });

    return result.data;
  }

  //   activation code
  static async activationCode(params: {
    email: string;
    code: number;
  }): Promise<ResponseStructure<ResponseActivationType | null>> {
    const { code, email } = params;
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseActivationType | null>
    >(`/activation-code/verify`, { email, code });

    return result.data;
  }

  //   resend email
  static async resendCode(
    email: string,
  ): Promise<ResponseStructure<ResponseActivationType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseActivationType | null>
    >(`/activation-code/resend-code`, { email });

    return result.data;
  }

  // cek token
  static async checkToken(): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.get<ResponseStructure<null>>(
      `/activation-code/cek-token`,
    );

    return result.data;
  }
}
