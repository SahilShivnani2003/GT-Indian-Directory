export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
}

export interface CreateSubcategory {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
}