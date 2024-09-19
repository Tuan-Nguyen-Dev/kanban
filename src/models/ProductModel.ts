export interface CategoryModel {
  _id: string;
  title: string;
  parentId: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface ProductModel {
  _id: string;
  title: string;
  slug: string;
  description: string;
  supplier: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  isDeleted: boolean;
}
