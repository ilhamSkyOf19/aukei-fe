import instanceAxios from "../libs/axios";
import type {
  CreateShadowFeatureType,
  ResponseShadowFeatureType,
  UpdateIsActiveShadowFeatureType,
} from "../models/shadowFeature.model";
import type { ResponseStructure } from "../types/response.type";

export class ShadowFeatureServices {
  // payment
  static async create(
    req: CreateShadowFeatureType,
  ): Promise<ResponseStructure<ResponseShadowFeatureType | null>> {
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseShadowFeatureType | null>
    >(`/shadow-feature`, req);

    return result.data;
  }

  static async updateIsActive(params: {
    id: number;
    req: UpdateIsActiveShadowFeatureType;
  }): Promise<ResponseStructure<ResponseShadowFeatureType | null>> {
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseShadowFeatureType | null>
    >(`/shadow-feature/${params.id}/is-active`, params.req);

    return result.data;
  }

  //   find is active
  static async findIsActive(): Promise<
    ResponseStructure<ResponseShadowFeatureType | null>
  > {
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseShadowFeatureType | null>
    >(`/shadow-feature/is-active`);

    return result.data;
  }

  // find for choose
  static async findForChoose(): Promise<
    ResponseStructure<ResponseShadowFeatureType[] | null>
  > {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseShadowFeatureType[] | null>
    >(`/shadow-feature/for-choose`);

    return result.data;
  }
}
