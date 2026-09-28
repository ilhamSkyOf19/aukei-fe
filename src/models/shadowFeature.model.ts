export interface CreateShadowFeatureType {
  nama?: string | null;
  nilai: number;
}

// update is active
export interface UpdateIsActiveShadowFeatureType {
  activedAt?: boolean;
  deactivedAt?: boolean;
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
