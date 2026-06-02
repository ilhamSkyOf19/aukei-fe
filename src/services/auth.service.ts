import instanceAxios from "../libs/axios";
import type { LoginType } from "../models/auth.model";
import type { PayloadPenggunaInternalType } from "../models/penggunaInternal.model";
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

  //   log out
  static async logout(): Promise<ResponseStructure<null>> {
    // call api
    const result =
      await instanceAxios.post<ResponseStructure<null>>("/auth/logout");

    //   return
    return result.data;
  }
}
