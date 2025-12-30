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

  recommendedProducts: Product[] = [];
  selectedVariant: any | null = null;

  constructor(
      private route: ActivatedRoute,
      private dataService: DataService,
      private basketService: BasketService,
      private router: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if(idParam){
        const id = Number(idParam);
        this.loadCard(id)
      }
    })
  }

  selectVariant(variant: any){
    this.selectedVariant = variant;
    this.selectedImage = variant.imageUrl;
    this.product!.color = variant.color;
    this.product!.price = variant.price ?? this.product!.price;
    this.product!.title = variant.title ?? this.product!.title;
    this.product!.description = variant.description ?? this.product!.description;
    this.product!.rating = variant.rating ?? this.product!.rating;
    this.product!.votes = variant.votes ?? this.product!.votes;
  }

  loadCard(id: number) {
    this.isLoading = true;

    this.selectedImage = null;
    this.selectedVariant = null;

    this.dataService.getCardById(id).subscribe(data => {
      this.product = data;
      this.isLoading = false;

      if(this.product?.variants?.length){
        this.selectedVariant = this.product.variants[0];
        this.selectedImage = this.selectedVariant.imageUrl || null;
      }else {
        this.selectedImage = null;
      }

      if(this.product?.category){
        this.loadRecommendations(this.product.category)
      }
    })
  }

  loadRecommendations(category: string){
    this.dataService.getCards().subscribe(cards => {
      this.recommendedProducts = Object.keys(cards)
        .map(key => ({id: Number(key), ...cards[key] }))
        .filter(card => card.category === category && card.id !==this.product?.id);
    });
  }
  openProductDetail(product: Product){
    this.router.navigate(['/product', product.id])
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
