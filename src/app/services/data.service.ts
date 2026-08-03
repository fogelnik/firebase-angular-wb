import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../components/product';
import {map, Observable, Subject, switchMap} from 'rxjs';
import {ProductResponse} from '../components/productResponse';
import {SellerProduct} from '../seller-product';
import {Review} from '../components/review';

@Injectable({
  providedIn: 'root'
})


export class DataService {

  private baseUrl = 'https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com';

  constructor(public http: HttpClient) { }

  pendingChanged$ = new Subject<void>();
  productPublished$ = new Subject<void>();


  getAllSellersProducts(): Observable<SellerProduct[]> {
    return this.http.get<any>(`${this.baseUrl}/sellers.json`).pipe(
      map(responseData => {
        console.log('1. Сырые данные из Firebase /sellers:', responseData);
        const allProducts: SellerProduct[] = [];

        if (!responseData) return allProducts;

        for (const sellerId in responseData){
          const sellerData = responseData[sellerId];

          if(sellerData?.products){
            for (const productId in sellerData.products){
              const product = sellerData.products[productId];

              allProducts.push({
                ...product,
                id: productId,
                sellerId
              })
            }
          }
        }

        return allProducts;
      })
    );
  }


  updateProductStatus(
    sellerId: string,
    productId: string,
    status: 'approved' | 'rejected'
  ){
    return this.http.patch(
      `${this.baseUrl}/sellers/${sellerId}/products/${productId}.json`,
      {status}
    )
  }

  publishToCards(product: SellerProduct): Observable<any>{
    const id = Date.now();

    const card: Product = {
      id,
      title: product.title,
      description: product.description,
      imageUrl: product.imageUrl || (product.images?.[0] ?? ''),
      images: product.images ?? [],
      price: product.price,
      color: product.color,
      article: product.article,
      category: product.category,
      rating: 0,
      votes: 0,
      itemCount: 1,
      isInCart: false,
      currentIndex: 0 //?
    };

    // return this.http.post(`${this.baseUrl}/cards.json`, card);
    return this.http.put(`${this.baseUrl}/cards/${id}.json`, card);
  }

  getCards(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>('https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com/cards.json'
    )
  }

  addProduct(userId: string, product: Partial<SellerProduct>){
    const newProduct = {
      ...product,
      status: 'pending'
    };

    return this.http.post(
      `${this.baseUrl}//sellers/${userId}/products.json`,
      newProduct
    )
  }

  getCardById(id: number): Observable<Product> {
     return this.http.get<Product>(
       `https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com/cards/${id}.json`
     )
  }

  getSellerProducts(userId: string): Observable<SellerProduct[]> {
    return this.http.get<{ [key: string]: SellerProduct }>(
      `${this.baseUrl}/sellers/${userId}/products.json`
      // `https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com/sellers/${userId}/products.json`
    ).pipe(
      map(response => {
        const products: SellerProduct[] = [];

        if(!response) return  products;

        for (const key in response){
          products.push({
            ...response[key],
            id: key
          });
        }

        return products;
      })
    );
  }


  deleteSellerProduct(userId: string, productId: string): Observable<void>{
    const baseUrl = 'https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com';
    return this.http.delete<void>(
      `${baseUrl}/sellers/${userId}/products/${productId}.json`
    )
  }

  addReview(productId: number, review: Review): Observable<any>{
    return this.http.put(
      `${this.baseUrl}/reviews/${productId}/${review.id}.json`,
      review
    );
  }

  getReviews(productId: number): Observable<Review[]>{
    return this.http.get<any>(`${this.baseUrl}/reviews/${productId}.json`).pipe(
      map(response => {
        if(!response) return [];
        return Object.keys(response).map(key => ({
          id: Number(key),
          ...response[key]
        }));
      })
    );
  }

  updateProductRating(productId: number, rating: number, votes: number){
    return this.http.patch(
      `${this.baseUrl}/cards/${productId}.json`,
      { rating, votes }
    );
  }
}
