export interface IJenisKeluarType {
  id: number;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateJenisKeluarType extends Pick<IJenisKeluarType, "nama"> {}

// response
export interface ResponseJenisKeluarType extends IJenisKeluarType {}
