export type CreatePeriodeShadowRequestType = {
  tahun: number;
  nilai: number;
};

export type UpdatePeriodeShadowRequestType = {
  tahun?: number;
  nilai?: number;
};

export type ResponsePeriodeShadowType = {
  id: number;
  tahun: number;
  nilai: number;
  createdAt?: Date;
  updatedAt?: Date;
};
