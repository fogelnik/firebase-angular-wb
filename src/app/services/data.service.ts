import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../components/product';
import {Observable} from 'rxjs';
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

  // getVariantCardById(id: number): Observable<Product>{
  //   return this.http.get<Product>(
  //     `https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com/cards/${id}/variants/${id}.json`
  //   )
  // }

}
