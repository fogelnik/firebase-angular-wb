export interface Product {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  images?: string[]
  price: number;
  color: string;
  rating: string;
  votes: number;
  itemCount: number;
  article: string;
  category?: string;
  isInCart: boolean;
  currentIndex?: number;
}
