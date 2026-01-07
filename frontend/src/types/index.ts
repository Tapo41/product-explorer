export interface Navigation {
  id: string;
  title: string;
  slug: string;
  url: string;
  last_scraped_at: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  navigation_id: string;
  parent_id: string | null;
  title: string;
  slug: string;
  url: string;
  product_count: number;
  last_scraped_at: string;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface Product {
  id: string;
  source_id: string;
  title: string;
  author: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  source_url: string;
  category_id: string | null;
  last_scraped_at: string;
  created_at: string;
  updated_at: string;
  detail?: ProductDetail;
  reviews?: Review[];
}

export interface ProductDetail {
  id: string;
  product_id: string;
  description: string | null;
  specs: Record<string, any> | null;
  ratings_avg: number | null;
  reviews_count: number;
  recommended_products: string[] | null;
  publisher: string | null;
  publication_date: string | null;
  isbn: string | null;
}

export interface Review {
  id: string;
  product_id: string;
  author: string | null;
  rating: number;
  text: string | null;
  review_date: string | null;
  created_at: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchResponse {
  products: Product[];
  total: number;
}