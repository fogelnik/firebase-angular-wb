import { Injectable } from '@angular/core';
import {Product} from '../components/product';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {user} from '@angular/fire/auth';



@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private items: Product[] = [];
  itemCount: number = 0;
  private uid : string | null = null
  private dbUrl = 'https://training-wb-angular-fire-proj-default-rtdb.firebaseio.com';
  isAuthenticated = false;

  public isCartReady: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    const uid = this.authService.getCurrentUserUid()
    if(uid){
      this.loadCartFromFirebase(uid)
    }else {
      this.getItems()
    }
  }


  setAuthState(uid: string){
    this.isAuthenticated = !!uid;
    this.uid = uid;
    if(this.isAuthenticated){
      this.loadCartFromFirebase(uid).subscribe(cart => {
        this.items = cart || [];
        this.itemCount = this.items.length;
        this.isCartReady = true;
      });
    }else {
      this.items = this.getItemsFromLocalStorage();
      this.itemCount = this.items.length;
      this.isCartReady = true;
    }
  }

  addToCart(product: Product){

    this.items.push(product);
    this.itemCount = this.items.length;

    if(this.isAuthenticated && this.uid){
      this.saveCartToFirebase(this.uid);
      console.log('UID найден, сохаранено на firebase:', this.uid);
    }else {
      console.warn('UID не найден, сохраняем в localStorage');
      this.saveToLocalStorage()
    }
    console.log('Добавлен товар:', product);
    console.log('товаров в корзине:', this.items.length)
    console.log('Авторизован:', this.isAuthenticated);
  }

  getItemsFromLocalStorage(): Product[] {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  }

  getItems(): Product [] {
    const cartFromLS = localStorage.getItem('cart');
    this.items = cartFromLS ? JSON.parse(cartFromLS) : [];
    return this.items;
  }

  getItemCount(): number{
    return this.items.reduce((acc, item) => acc + (item.itemCount || 1 ), 0);
  }
  updateCart(updatedItems: Product[]){
    this.items = updatedItems;
    this.itemCount = updatedItems.length;

    if(this.isAuthenticated && this.uid){
      this.saveCartToFirebase(this.uid)
    }else {
      this.saveToLocalStorage()
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items))
  }

  saveCartToFirebase( uid: string){
    this.http.put(`${this.dbUrl}/carts/${uid}.json`, this.items).subscribe({
      next: () => console.log('Корзина сохранена в Firebase'),
      error: err => console.error('Ошибка сохранения в Firebase:', err)
    })
  }

  loadCartFromFirebase(uid: string): Observable<Product[]>{
    const url = `${this.dbUrl}/carts/${uid}.json`;
    return this.http.get<Product[]>(url)
  }

  resetAuthState() {
    this.isAuthenticated = false;
    this.uid = null;
    this.items = this.getItemsFromLocalStorage();
    this.itemCount = this.items.length
  }

  // syncLocalCartToFirebase(uid: string){
  //   const localCart = this.getItemsFromLocalStorage();
  //   if(localCart.length > 0){
  //     this.http.put(`${this.dbUrl}/carts/${uid}.json`, localCart).subscribe({
  //       next: () => {
  //         localStorage.removeItem('cart');
  //         console.log("Локальная корзина перенесена в Firebase");
  //       },
  //       error: err => console.error('Ошибка переноса корзины:', err)
  //     });
  //   }
  // }

  appendLocalCartToFirebase(uid: string){
    const localCart = this.getItemsFromLocalStorage();

    if(localCart.length === 0) return;
    const url = `${this.dbUrl}/carts/${uid}.json`;

    this.http.get<Product[]>(url).subscribe(firebaseCart => {
      const updateCart = [...(firebaseCart || []), ...localCart];

      this.http.put(url, updateCart).subscribe({
        next: () => {
          this.items = updateCart;
          this.itemCount = this.getItemCount();
          localStorage.removeItem('cart');
          console.log("Локальная корзина перенесена в Firebase");
        },
        error: err => console.error('Ошибка переноса корзины:', err)
      });
    });
  }

}
