import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {Product} from '../product';
import {BasketService} from '../../services/basket.service';
import {QuickViewComponent} from './quick-view/quick-view.component';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  imports: [
    NgForOf,
    NgIf,
    QuickViewComponent
  ],
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{

  cards: Product[] = [];
  isLoading = true;
  hoveredCard: Product | null = null;
  selectedProduct: Product | null = null;
  isQuickViewOpen = false;

  private notificationTimeout: any
  notification: string | null = null


  constructor(
    private dataService: DataService,
    private router: Router,
    private basketService: BasketService
  ) {}

  ngOnInit() {
    this.loadProducts()
  }

  loadProducts() {
    this.isLoading = true;
    this.dataService.getCards().subscribe((data) => {
      this.cards = data;
      this.isLoading = false;
    })
  }

  toggleCart(card: Product): void {
    card.isInCart = !card.isInCart;
    if(card.isInCart){
      this.basketService.addToCart(card)
      this.showNotification('Товар добавлен в корзину')
    }else {
      this.router.navigate(['/basket'])
    }
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
  }

  openQuickView(card: Product): void{
    this.selectedProduct = card;
    this.isQuickViewOpen = true;
  }

}
