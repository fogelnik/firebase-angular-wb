import {Component, OnInit} from '@angular/core';
import {BasketService} from '../../services/basket.service';
import {Router} from '@angular/router';
import {Product} from '../product';
import {AuthService} from '../../services/auth.service';
import {Auth, onAuthStateChanged} from '@angular/fire/auth';
import {NgForOf, NgIf} from '@angular/common';


@Component({
  selector: 'app-basket',
  standalone: true,
  templateUrl: './basket.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit{

  public itemCount = 0
  basket: Product[] = []
  sum: number = 0;

  private notificationTimeout: any
  // notification: string | null
  notifications: string[] = [];



  displayedSums: number[] = [];
  displayedTotal: number = 0;
  private totalAnimationTimer: any

  isLoading: boolean = true;

  constructor(private basketService: BasketService, private router: Router, private authService : AuthService, private auth: Auth) {
  }

   ngOnInit() {
    // this.isLoading = true;

     this.displayedSums = this.basket.map(item => item.price * this.itemCount);

    onAuthStateChanged(this.auth, (user) => {
      if(user){
        this.basketService.appendLocalCartToFirebase(user.uid);
        this.itemCount = this.basketService.getItemCount();

        this.basketService.loadCartFromFirebase(user.uid).subscribe(cart => {
          this.basket = (cart || []).map(item => ({
            ...item,
            itemCount: item.itemCount || 1
          }));
          // this.itemCount = this.basket.length;
          this.itemCount = this.basket.reduce((acc, item) => acc + item.itemCount, 0);
          this.calculateTotalPrice()
          // this.isLoading = false;
        });
      }else {
        this.basket = this.basketService.getItemsFromLocalStorage().map(item => ({
          ...item,
          itemCount: item.itemCount || 1
        }));
        // this.itemCount = this.basket.length;
        this.itemCount = this.basket.reduce((acc, item) => acc + item.itemCount, 0);
        this.calculateTotalPrice();
        // this.isLoading = false;
      }
    });
  }

  calculateTotalPrice() {
    const newTotal = this.basket.reduce((acc, item) => acc + item.price * item.itemCount, 0);
    const target = parseFloat(newTotal.toFixed(2));

    // Анимация для displayedTotal
    if (this.totalAnimationTimer) {
      clearInterval(this.totalAnimationTimer);
    }

    let current = this.displayedTotal;
    const step = (target - current) / 20;
    let count = 0;

    this.totalAnimationTimer = setInterval(() => {
      current += step;
      count++;
      this.displayedTotal = parseFloat(current.toFixed(2));

      if (count >= 20) {
        this.displayedTotal = target;
        clearInterval(this.totalAnimationTimer);
      }
    }, 20);

    this.sum = target;
  }

  // animateSum(index: number){
  //   const target = this.basket[index].price * this.basket[index].itemCount;
  //   let current = this.displayedSums[index];
  //   const step = (target - current) / 20;
  //   let count = 0;
  //
  //   const interval = setInterval(() => {
  //     current += step;
  //     count++;
  //     this.displayedSums[index] = parseFloat(current.toFixed(2));
  //
  //     if(count >= 20){
  //       this.displayedSums[index] = parseFloat(target.toFixed(2));
  //       clearInterval(interval);
  //     }
  //   },20)
  // }



  // calculateTotalPrice(){
  //   this.sum = this.basket.reduce((acc, item) => {
  //     return acc + (item.price * (item.itemCount || 1));
  //   }, 0);
  //
  //   this.sum = parseFloat(this.sum.toFixed(2));
  // }

  removeItem(index: number){
    // const confirmed = confirm('Удалить товар из корзины?')
    this.basket.splice(index, 1);
    this.showNotification('Товар удален из корзины')
    this.basketService.updateCart(this.basket);
    this.updateItemCount()
    this.calculateTotalPrice()
    console.log("Продукт удален из карзины:", index)
  }

  showNotification(message: string) {

    this.notifications.push(message);

    if(this.notifications.length > 5 ){
      this.notifications.shift();
    }

    setTimeout(() => {
      this.notifications = this.notifications.filter(n  => n !== message);
    }, 4000)
    // if (this.notificationTimeout){
    //   clearTimeout(this.notificationTimeout)
    // }
    // this.notification = null;
    //
    // setTimeout(() => {
    //   this.notification = message;
    //
    //   this.notificationTimeout = setTimeout(() => {
    //     this.notification = null;
    //   }, 4000)
    // }, 10)
  }

  goToMain() {
    this.router.navigate(['/'])
  }

  get count(): number{
    return this.basketService.getItemCount()
  }

  decrementItemCount(index: number){
    if(this.basket[index].itemCount > 1){
      this.basket[index].itemCount -= 1;
      this.sum = this.sum - Number(this.basket[index].price);
      this.updateItemCount()
      this.calculateTotalPrice();

      this.showNotification('Товар уменьшен в количестве')
      // this.animateSum(index)

      this.basketService.updateCart(this.basket);
    }
  }

  addItem(index: number){

    this.basket[index].itemCount = (this.basket[index].itemCount || 1) + 1;
    this.basketService.updateCart(this.basket);

    this.updateItemCount();
    this.showNotification('Товар увеличен в количестве')

    this.calculateTotalPrice();
  }

  updateItemCount() {
    this.itemCount = this.basket.reduce((acc, item) => acc + item.itemCount, 0);
  }
}
