import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Product} from '../components/product';
import {BehaviorSubject, Observable} from 'rxjs';
import {Auth, onAuthStateChanged, user} from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private favorites: Product[] = [];
  private favorites$ = new BehaviorSubject<Product[]>([])

  private uid: string | null = null;
  private dbUrl = 'https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com';
  isAuthenticated  = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private auth: Auth,
  )
  {
    onAuthStateChanged(this.auth, (user) => {
      if(user){
        this.loadFavoritesFromFirebase(user.uid).subscribe(favs => {
          this.favorites = favs || [];
          this.favorites$.next(this.favorites);
        });
      }else {
        this.favorites = [];
        this.favorites$.next([])
      }
    })

    // const uid = this.authService.getCurrentUserUid();
    // if(uid){
    //   this.setAuthState(uid);
    // }

  }

  // setAuthState(uid: string){
  //   this.isAuthenticated = !!uid;
  //   this.uid = uid;
  //   if(this.isAuthenticated){
  //     this.loadFavoritesFromFirebase(uid).subscribe(favs => {
  //       this.favorites = favs || [];
  //     });
  //   }else {
  //     this.favorites = []
  //   }
  // }

  addToFavorites(product: Product){
    const user = this.auth.currentUser;
    if(!user){
      console.log('Чтобы добавить товар в избранное, войдите в аккаунт!');
      return
    }
    const exists = this.favorites.some(p => p.id === product.id);
    if(!exists){
      this.favorites.push(product);
      this.saveFavoritesRoFirebase(user.uid);
      this.favorites$.next(this.favorites)
    }
    // const uid = this.authService.getCurrentUserUid()
    // if(!uid){
    //   console.log('Чтобы добавить товар в избранное, войдите в аккаунт!');
    //   return;
    // }
    // // if(!this.isAuthenticated || !this.uid){
    // //   console.log('Чтобы добавить товар в избранное, войдите в аккаунт!');
    // //   return;
    // // }
    // const exists = this.favorites.some(p => p.id === product.id);
    // if(!exists){
    //   this.favorites.push(product);
    //   this.saveFavoritesRoFirebase(uid);
    //   console.log('Товар добавлен в избранное:', product)
    // }else {
    //   console.log('Товар уже в избранном');
    // }
  }

  removeFromFavorites(productId: string){
    if(!this.isAuthenticated || !this.uid){
      alert('Чтобы удалить товар из избранного, войдите в аккаунт!');
      return
    }
  }

  getFavorites(): Observable<Product[]>{
    return this.favorites$;
  }

  saveFavoritesRoFirebase(uid: string){
    this.http.put(`${this.dbUrl}/favorites/${uid}.json`, this.favorites).subscribe({
      next:() => console.log('Избранное сохранено в Firebase'),
      error: err => console.error('Ошибка сохранения избранного:', err)
    })
  }

  loadFavoritesFromFirebase(uid: string): Observable<Product[]>{
    const url = `${this.dbUrl}/favorites/${uid}.json`;
    return this.http.get<Product[]>(url)
  }

}
