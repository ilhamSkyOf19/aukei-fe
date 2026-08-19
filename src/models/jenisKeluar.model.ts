export interface IJenisKeluarType {
  id: number;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateJenisKeluarType extends Pick<IJenisKeluarType, "nama"> {}

// update
export interface UpdateJenisKeluarType extends Partial<CreateJenisKeluarType> {
  id?: number;
}

// response
export interface ResponseJenisKeluarType extends IJenisKeluarType {}
