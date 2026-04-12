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
  similarCards: Product[] = [];

  selectedSimilarCardId: number | null = null;


  constructor(
      private route: ActivatedRoute,
      private dataService: DataService,
      private basketService: BasketService,
      private router: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // route - Это объект типа ActivatedRoute, который предоставляет информацию о текущем маршруте (URL), по которому зашёл пользовател
      // paramMap: содержит все параметры URL, например id
      // subscribe: подписываюсь — что бы выполнять код, когда параметры поменяются

      const idParam = params.get('id');
      // Ищу число id из URL — например, если URL /product/123, то id = 123
      if(idParam){
        const id = Number(idParam);
        // Преобразую его в число (Number(idParam)) и вызываю loadCard, чтобы загрузить данные о товаре
        this.loadCard(id)
      }
    })
  }

  // selectVariant(variant: any){
  //   this.selectedVariant = variant;
  //   this.selectedImage = variant.imageUrl;
  //   this.product!.color = variant.color;
  //   this.product!.price = variant.price ?? this.product!.price;
  //   this.product!.title = variant.title ?? this.product!.title;
  //   this.product!.description = variant.description ?? this.product!.description;
  //   this.product!.rating = variant.rating ?? this.product!.rating;
  //   this.product!.votes = variant.votes ?? this.product!.votes;
  // }

  // loadCard(id: number) {
  //   this.isLoading = true;
  //
  //   this.selectedImage = null;
  //   this.selectedVariant = null;
  //
  //   this.dataService.getCardById(id).subscribe(data => {
  //     this.product = data;
  //     this.isLoading = false;
  //
  //     this.selectedImage = this.product?.imageUrl || null;
  //
  //     if(this.product?.category){
  //       this.loadRecommendations(this.product.category)
  //     }
  //   })
  // }

  loadCard(id: number){
    this.isLoading = true;
    this.selectedImage = null;
    this.selectedVariant = null;

    this.dataService.getCardById(id).subscribe(data => {
      this.product = data;
      this.isLoading = false;

      if(this.product){
        this.selectedImage = this.product.images?.length ? this.product.images[0] : (this.product.imageUrl || null);

          if(this.product.category){
            this.loadRecommendations(this.product.category, id);
          }

          if(this.product.description){
            this.loadSimilarCards(this.product.description, id)
          }
      }

      // if(this.product?.images && this.product?.images?.length > 0){
      //   this.selectedImage = this.product.images[0];
      // }else {
      //   this.selectedImage = this.product?.imageUrl || null;
      // }
      //
      // if(this.product?.category){
      //   this.loadRecommendations(this.product.category)
      // }
      //
      // if(this.product?.description){
      //   this.loadSimilarCards(this.product.description, this.product.id)
      // }
    })
  }

  loadSimilarCards(description: string, currentId: number){
    this.dataService.getCards().subscribe(cards => {
      this.similarCards = Object.keys(cards)
        .map(key => ({id: Number(key), ...cards[key] }))
        .filter(card => card.description === description && Number(card.id) !== currentId)
    })
  }

  // loadRecommendations(category: string){
  //   this.dataService.getCards().subscribe(cards => {
  //     this.recommendedProducts = Object.keys(cards)
  //       // Object.keys(cards) - получает массив всех ключей из объекта cards
  //       // Ключи — это ID каждого товара, например: ["1", "2", "3"] (они — строки)
  //       .map(key => ({id: Number(key), ...cards[key] }))
  //       // Проходит по каждому ключу (ID как строка)
  //       // Создает новый объект:
  //       //   id: Number(key) — превращает строку ID в число.
  //       //   ...cards[key] — добавляет все свойства товара из cards по этому ключу
  //       .filter(card => card.category === category && card.id !== this.product?.id);
  //   });
  // }
  loadRecommendations(category: string, currentId: number){
    this.dataService.getCards().subscribe(cards => {
      this.recommendedProducts = Object.keys(cards)
        .map(key => ({id: Number(key), ...cards[key] }))
        .filter(card => card.category === category && Number(card.id) !== currentId);
      console.log(this.recommendedProducts)
    })
  }
  openProductDetail(product: Product){
    this.router.navigate(['/product', product.id])
    this.selectedSimilarCardId = product.id
  }

  addToBasket(product: Product | null){
    if(!product) return

    const itemToAdd = this.selectedVariant
    ? {
      ...product,
        imageUrl: this.selectedVariant.imageUrl,
        color: this.selectedVariant.color ?? product.color,
        price: this.selectedVariant.price ?? product.price,
        description: this.selectedVariant.description ?? product.description,
        title: this.selectedVariant.title ?? product.title,
        rating: this.selectedVariant.rating ?? product.rating,
        votes: this.selectedVariant.votes ?? product.votes,
      }
    : product;

    itemToAdd.isInCart = true;
    this.basketService.addToCart(itemToAdd)
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
