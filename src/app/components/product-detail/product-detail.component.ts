import {Component, OnInit} from '@angular/core';
import {Product} from "../product";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {NgForOf, NgIf} from '@angular/common';
import {BasketService} from '../../services/basket.service';


@Component({
  selector: 'app-product-detail',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit{

  product: Product | null = null;
  isAddedToBasket = false

  addFavorites = false

  selectedImage: string | null = null;

  private notificationTimeout: any
  notification: string | null = null

  isLoading = false;

  constructor(
      private route: ActivatedRoute,
      private dataService: DataService,
      private basketService: BasketService,
      private router: Router,
  ) {}

  ngOnInit() {
    this.loadCard()
  }

  loadCard() {
    this.isLoading = true;
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam){
      const id = Number(idParam);
      this.dataService.getCardById(id).subscribe(data => {
        this.product = data;

        this.isLoading = false;

      })
    }
  }


  addToBasket(product: Product | null){
    if(!product) return
    product.isInCart = true;
    this.basketService.addToCart(product)
    this.isAddedToBasket = true
    this.showNotification('Товар добавлен в корзину')
  }

selectImage(img: string){
    this.selectedImage = img
}

  goToBasket(){
    this.router.navigate(['/basket'])
  }

  goToProduct(){
    this.router.navigate(['/product'])
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

  goToFavorites() {
    this.addFavorites = !this.addFavorites
  }
}
