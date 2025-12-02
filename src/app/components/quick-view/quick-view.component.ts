import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from '../product';
import {NgIf} from '@angular/common';
import {BasketService} from '../../services/basket.service';
import {Router} from '@angular/router';
import {FavoritesService} from '../../services/favorites.service';

@Component({
  selector: 'app-quick-view',
  imports: [
    NgIf
  ],
  templateUrl: './quick-view.component.html',
  styleUrl: './quick-view.component.scss'
})
export class QuickViewComponent {

  private notificationTimeout: any
  notification: string | null = null

  clickFavorite = false

  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  constructor(
    private basketService: BasketService,
    private favoriteService: FavoritesService,
    private router: Router,
    ) {}

  close() {
    this.closed.emit()
  }

 addToCart(product: Product | null){
    if(!product) return;
    product.isInCart = true;
    this.basketService.addToCart(product)
    this.showNotification('Товар добавлен в корзину')
 }
 goToBasket(){
    this.router.navigate(['/basket'])
 }

  showNotification(message: string) {
    if (this.notificationTimeout){
      clearTimeout(this.notificationTimeout)
    }
    this.notification = null;

    setTimeout(() => {
      this.notification = message;

      this.notificationTimeout = setTimeout(() => {
        this.notification = null;
      }, 4000)
    }, 10)
    console.log('Товар добавлен в корзину')
  }

  openProductDetail(product: Product | null){
    if(product && product.id != null){
      this.router.navigate(['/product', product.id]);
      this.close();
    }else {
      console.error('Product ID is undefined');
    }
  }

  goToFavorites() {
    this.clickFavorite = !this.clickFavorite
  }

}
