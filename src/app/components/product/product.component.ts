import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {Product} from '../product';
import {BasketService} from '../../services/basket.service';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{

  cards: Product[] = [];
  isLoading = true;

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
    }else {
      this.router.navigate(['/basket'])
    }
  }

}
