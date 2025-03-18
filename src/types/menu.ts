export interface Menu {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  defaultSauce: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuDto {
  name: string;
  description: string;
  basePrice: number;
  defaultSauce: string;
  isAvailable: boolean;
  image?: File;
} 