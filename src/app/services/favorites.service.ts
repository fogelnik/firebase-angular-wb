import { Injectable } from '@angular/core';
import {Product} from '../components/product';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private dbUrl = 'https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com';
  private uid : string | null = null;
  itemCount: number = 0;
  private items: Product[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    const uid = authService.getCurrentUserUid()
  }


  saveCartToFirebase(uid: string){
    this.http.put(`${this.dbUrl}/favorites/${uid}.json`, this.items).subscribe({
      next: () => console.log('Избранные сохранены на firebase'),
      error: err => console.log('Ошибка сохранения в Firebase', err)
    })
  }
}
