import instanceAxios from "../libs/axios";
import type { LoginType } from "../models/auth.model";
import type {
  PayloadPenggunaInternalType,
  UpdateDataPenggunaType,
} from "../models/penggunaInternal.model";
import type { ResponseStructure } from "../types/response.type";

export class AuthServices {
  // login
  static async login(req: LoginType): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.post<ResponseStructure<null>>(
      "/auth/login",
      req,
    );

    return result.data;
  }

  static async refresh(): Promise<ResponseStructure<null>> {
    // call api
    const result =
      await instanceAxios.post<ResponseStructure<null>>("/auth/refresh");

    return result.data;
  }

  // update password
  static async updatePassword(req: {
    password: string;
    confirmPassword: string;
  }): Promise<ResponseStructure<PayloadPenggunaInternalType | null>> {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<PayloadPenggunaInternalType | null>
    >("/auth/password", req);

    return result.data;
  }

  // reset password
  static async resetPassword(req: {
    password: string;
    confirmPassword: string;
  }): Promise<ResponseStructure<PayloadPenggunaInternalType | null>> {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<PayloadPenggunaInternalType | null>
    >("/auth/reset-password", req);

    return result.data;
  }

  //   me
  static async me(): Promise<
    ResponseStructure<PayloadPenggunaInternalType | null>
  > {
    // call api
    const result =
      await instanceAxios.get<
        ResponseStructure<PayloadPenggunaInternalType | null>
      >("/auth/me");

    //   return
    return result.data;
  }

  // update data pengguna
  static async updateDataPengguna(
    req: Partial<UpdateDataPenggunaType>,
  ): Promise<ResponseStructure<PayloadPenggunaInternalType | null>> {
    // call api
    const result = await instanceAxios.patch<ResponseStructure<null>>(
      "/auth/data-pengguna",
      req,
    );

    return result.data;
  }

  //   log out
  static async logout(): Promise<ResponseStructure<null>> {
    // call api
    const result =
      await instanceAxios.post<ResponseStructure<null>>("/auth/logout");

    //   return
    return result.data;
  }
}
