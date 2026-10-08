import type { PayloadPenggunaInternalType } from "./penggunaInternal.model";

export interface IActivationCode {
  id: number;
  pengguna: PayloadPenggunaInternalType;
  expiredAt: Date;
  resetToken: string;
  code: number;
}

// send email
export interface SendEmailType {
  email: string;
}

// activation code
export interface ActivationRequestType {
  code: number;
}

// response activation code
export interface ResponseActivationType extends Omit<
  IActivationCode,
  "code" | "resetToken"
> {}

// to response
export const toResponseActivationType = (
  activation: ResponseActivationType,
): ResponseActivationType => activation;

export interface ActivationLocalStorageType {
  email: string;
  expiredAt: Date;
}
