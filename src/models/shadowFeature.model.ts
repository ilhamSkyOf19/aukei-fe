export interface CreateShadowFeatureType {
  nama?: string;
  nilai: number;
}

// update is active
export interface UpdateIsActiveShadowFeatureType {
  activedAt?: Date;
  deactivedAt?: Date;
}

// response
export interface ResponseShadowFeatureType {
  id: number;
  nama?: string | null;
  nilai: number;
  isActive: boolean;
  activedAt?: Date | null;
  deactivedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
