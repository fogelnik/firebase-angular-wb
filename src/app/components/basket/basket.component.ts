import {Component, OnInit} from '@angular/core';
import {BasketService} from '../../services/basket.service';
import {Router} from '@angular/router';
import {Product} from '../product';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-basket',
  standalone: false,
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit{

  itemCount = 0
  basket: Product[] = []
  sum: number = 0;

  constructor(private basketService: BasketService, private router: Router, private authService : AuthService) {
  }

  ngOnInit() {
    const uid = this.authService.getCurrentUserUid();
    if(uid){
      this.basketService.loadCartFromFirebase(uid).subscribe(cart => {
        if(cart) {
          this.basket = cart.map(item => ({
            ...item,
            itemCount: item.itemCount
          }));
          this.itemCount = this.basket.length;
          this.calculateTotalPrice();
        }else {
          this.basket = [];
        }
      })
    }else {
      this.basket = this.basketService.getItems().map((item: Product) => ({
        ...item,
        itemCount: item.itemCount || 1
      }));
      this.itemCount = this.basketService.getItemsCount();
      this.calculateTotalPrice()
    }
  }

  calculateTotalPrice(){
    this.sum = this.basket.reduce((acc, item) => {
      return acc + (item.price * (item.itemCount || 1));
    }, 0);

    this.sum = parseFloat(this.sum.toFixed(2));
  }

  removeItem(index: number){
    this.basket.splice(index, 1);
    this.basketService.removeFromCart(index);
    this.calculateTotalPrice()
    this.itemCount = this.basket.length;
  }

  goToMain() {
    this.router.navigate(['/'])
  }

  decrementItemCount(index: number){
    if(this.basket[index].itemCount > 1){
      this.basket[index].itemCount -= 1;
      this.sum = this.sum - Number(this.basket[index].price)

      this.basketService.updateCart(this.basket);
    }
  }

  addItem(index: number){
    this.basket[index].itemCount += 1;
    this.sum = this.sum + Number(this.basket[index].price)

    this.basketService.updateCart(this.basket);
  }

}
