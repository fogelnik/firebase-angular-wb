export interface SellerProduct {
  id?: string; // Firebase key
  title: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  price: number;
  color: string;
  article: string;
  category?: string;

  status: 'pending' | 'approved' | 'rejected'; // обязательно
  sellerId?: string; // добавляется при flatten в DataService
}
