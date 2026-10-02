import instanceAxios from "../libs/axios";
import type {
  CreatePeriodeShadowRequestType,
  ResponsePeriodeShadowType,
  UpdatePeriodeShadowRequestType,
} from "../models/periodeShadow.model";
import type { ResponseStructure } from "../types/response.type";

export class PeriodeShadowServices {
  // find all
  static async findAll(): Promise<
    ResponseStructure<Array<
      ResponsePeriodeShadowType & {
        lastGenerate?: Date | null;
      }
    > | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<Array<
        ResponsePeriodeShadowType & {
          lastGenerate?: Date | null;
        }
      > | null>
    >(`/periode-shadow`);

    return result.data;
  }

  // find by id
  static async findById(params: {
    id: number;
  }): Promise<ResponseStructure<ResponsePeriodeShadowType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponsePeriodeShadowType | null>
    >(`/periode-shadow/${params.id}`);

    return result.data;
  }

  // create
  static async create(
    req: CreatePeriodeShadowRequestType,
  ): Promise<ResponseStructure<ResponsePeriodeShadowType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponsePeriodeShadowType | null>
    >(`/periode-shadow`, req);

    return result.data;
  }

  // update
  static async update(params: {
    id: number;
    req: UpdatePeriodeShadowRequestType;
  }): Promise<ResponseStructure<ResponsePeriodeShadowType | null>> {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ResponsePeriodeShadowType | null>
    >(`/periode-shadow/${params.id}`, params.req);

    return result.data;
  }

  // delete
  static async delete(params: {
    id: number;
  }): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/periode-shadow/${params.id}`,
    );

    return result.data;
  }
}
