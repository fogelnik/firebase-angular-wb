export interface Product {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  color: string;
  rating: string;
  votes: number;
  itemCount: number;

  isInCart: boolean;
}
