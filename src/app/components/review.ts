export interface Review {
  id: number;
  productId: number;
  userId: string | null;
  userName: string;
  rating: number;
  text: string;
  date: string;
}
