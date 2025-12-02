import { Injectable } from '@angular/core';
import {Product} from '../components/product';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private items: Product[] = [];
  private uid : string | null = null
  private dbUrl = 'https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com';
  isAuthenticated = false;
  favoritesCount:number = 0;

  constructor(
    private http: HttpClient,
    private authService: AuthService)
  {

  }

}
