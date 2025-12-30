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
  category?: string;
  variants?: {
    color: string;
    imageUrl: string;
    price?: number;
    votes: number;
    rating: string;
    description: string;
    title: string;
  }[];

  isInCart: boolean;
  currentIndex?: number;
}
