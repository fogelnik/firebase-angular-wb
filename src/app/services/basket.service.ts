import { Injectable } from '@angular/core';
import {Product} from '../components/product';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private items: Product[] = [];
  itemCount: number = 0;
  private uid : string | null = null
  private dbUrl = 'https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com';
  isAuthenticated = false;


  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
      const uid = this.authService.getCurrentUserUid();
      if(uid){
        this.loadCartFromFirebase(uid);
      }
  }

  setAuthState(uid: string){
   this.isAuthenticated = !!uid;
   this.uid = uid;

   if(this.isAuthenticated && uid){
     this.loadCartFromFirebase(uid).subscribe(cart => {
       this.items = cart || [];
     })
   }else {
     this.items = this.getItemsFromLocalStorage()
   }
  }

  addToCart(product: Product){
    this.items.push(product);
    this.itemCount = this.items.length;
    this.saveToLocalStorage();

    console.log('Добавлен товар:', product);
    console.log('Авторизован:', this.isAuthenticated);

    if(this.isAuthenticated){
      const uid = this.authService.getCurrentUserUid();
      console.log('UID:', uid);
      if (uid) {
        this.saveCartToFirebase(uid);
      }else {
        console.warn('UID не найден, сохраняем в localStorage');
        this.saveToLocalStorage()
      }
    }
  }

  getItemsFromLocalStorage(): Product[] {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  }

  getItems(){
   const saveCart = localStorage.getItem('cart');
   return saveCart ? JSON.parse(saveCart) : [];
  }

  getItemsCount(){
    return this.getItems().length;
  }

  removeFromCart(index: number){
    this.items.splice(index, 1);
    this.itemCount = this.items.length
    this.saveToLocalStorage();

    console.log("Продукт удален из карзины:", index)

    const uid = this.authService.getCurrentUserUid();
    if (uid) {
      this.saveCartToFirebase(uid);
    }

  }

  updateCart(updatedItems: Product[]) {
    this.items = updatedItems;
    this.itemCount = updatedItems.length;
    this.saveToLocalStorage();

    const uid = this.authService.getCurrentUserUid();
    if (uid) {
      const url = `${this.dbUrl}/carts/${uid}.json`;
      this.http.put(url, this.items).subscribe(() => {
        console.log('Корзина обновлена в Firebase');
      });
    }
  }

  private saveCartToFirebase(uid: string) {
    const url = `${this.dbUrl}/carts/${uid}.json`;
    this.http.put(url, this.items).subscribe(() => {
      console.log('Корзина сохранена в Firebase');
    });
  }

  loadCartFromFirebase(uid: string): Observable<Product[]> {
    const url = `${this.dbUrl}/carts/${uid}.json`;
    return this.http.get<Product[]>(url);
  }

  private saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items))
  }

  // private loadCartFromLocalStorage() {
  //   const saveCart = localStorage.getItem('cart');
  //   if(saveCart){
  //     this.items = JSON.parse(saveCart) as Product[]
  //   }
  // }


}
