import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../components/product';
import {map, Observable} from 'rxjs';
import {ProductResponse} from '../components/productResponse';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(public http: HttpClient) { }

  getCards(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>('https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com/cards.json'
    )
  }

  addProduct(userId: string, product: Partial<Product>){
    return this.http.post(`https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com/sellers/${userId}/products.json`, product);
  }

  getCardById(id: number): Observable<Product> {
     return this.http.get<Product>(
       `https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com/cards/${id}.json`
     )
  }

  getSellerProducts(userId: string): Observable<Product[]> {
    return this.http.get<{ [key: string]: Product }>(
      `https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com/sellers/${userId}/products.json`
    ).pipe(
      map(responseData => {
        const productsArray: Product[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            // Добавляем товар в массив и сохраняем ключ из Firebase как id
            productsArray.push({ ...responseData[key], id: key as any });
          }
        }
        return productsArray;
      })
    );
  }

  deleteSellerProduct(userId: string, productId: string): Observable<void>{

    const baseUrl = 'https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com';
    return this.http.delete<void>(
      `${baseUrl}/sellers/${userId}/products/${productId}.json`
    )
  }

  // getVariantCardById(id: number): Observable<Product>{
  //   return this.http.get<Product>(
  //     `https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com/cards/${id}/variants/${id}.json`
  //   )
  // }

}
