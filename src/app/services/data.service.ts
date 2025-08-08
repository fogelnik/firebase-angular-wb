import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../components/product';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(public http: HttpClient) { }

  getCards() {
    return this.http.get<Product[]>('https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com/cards.json')
  }
}
