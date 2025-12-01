import {Product} from './product';

export interface ProductResponse{
  [key: string]: Omit<Product, 'id'>;
}
