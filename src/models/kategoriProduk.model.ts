export interface IKategoriProdukType {
  id: number;
  nama: string;
  keterangan: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateKategoriProdukType extends Pick<
  IKategoriProdukType,
  "nama"
> {
  keterangan?: string;
}

// update
export interface UpdateKategoriProdukType extends Partial<CreateKategoriProdukType> {}

// response
export interface KategoriProdukResponseType extends IKategoriProdukType {}
