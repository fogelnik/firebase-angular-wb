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

  getCardById(id: number): Observable<Product> {
     return this.http.get<Product>(
       `https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com/cards/${id}.json`
     )
  }



}
