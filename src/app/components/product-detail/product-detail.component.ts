import {Component, OnInit} from '@angular/core';
import {Product} from "../product";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {BasketService} from '../../services/basket.service';
import {Review} from '../review';
import {AuthService} from '../../services/auth.service';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-product-detail',
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    FormsModule
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

  reviews: Review[] = [];
  newReviewText = '';
  newReviewRating = 5;
  isAuthenticated = false;

  hoverRating = 0;
  reviewError: string | null = null;

  constructor(
      private route: ActivatedRoute,
      private dataService: DataService,
      private basketService: BasketService,
      private router: Router,
      private authService: AuthService,
  ) {}

  ngOnInit() {

    this.isAuthenticated = !!this.authService.getCurrentUserUid();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (!idParam) {
        console.error('ID товара не найден в URL');
        return;
      }

      const id = Number(idParam);

      if (isNaN(id)) {
        console.error('Некорректный ID в URL:', idParam);
        return;
      }

      this.loadCard(id);
      this.loadReviews(id);
    });
  }

  setRating(star: number){
    this.newReviewRating = star;
  }
  loadCard(id: number){
    this.isLoading = true;
    this.selectedImage = null;
    this.selectedVariant = null;

    this.selectedSimilarCardId = id;

    this.dataService.getCardById(id).subscribe(data => {
      this.product = data;
      this.isLoading = false;

      if(this.product){
        this.selectedImage = this.product.images?.length
        ? this.product.images[0]
          : (this.product.imageUrl || null);

        if(this.product.category){
          this.loadRecommendations(this.product.category, id);
        }
        if(this.product.description){
          this.loadSimilarCards(this.product.description)
        }
      }
    })
  }

  loadReviews(productId: number){
    this.dataService.getReviews(productId).subscribe(reviews => {
      this.reviews = reviews;
    })
  }

  addReview() {
    if (!this.product) {
      console.error('Товар не загружен');
      return;
    }

    if (!this.product.id || isNaN(this.product.id)) {
      console.error('Некорректный product.id:', this.product.id);
      return;
    }

    if(!this.newReviewText || this.newReviewText.trim().length === 0){
      this.reviewError = 'Пожалуйста, напишите отзыв перед отправкой';
      return;
    }

    this.reviewError = null;

    const review: Review = {
      id: Date.now(),
      productId: this.product.id,
      userId: this.authService.getUserId(),
      userName: this.authService.getUserName(),
      rating: this.newReviewRating,
      text: this.newReviewText,
      date: new Date().toISOString()
    };

    this.dataService.addReview(this.product.id, review).subscribe(() => {
      this.reviews.push(review);

      const votes = this.reviews.length;

      const ratingSum = this.reviews.reduce((sum, r) => sum + r.rating, 0);
      const rating = ratingSum / votes;

      if (!this.product) {
        console.error('product is null');
        return;
      }

      this.dataService.updateProductRating(this.product.id, rating, votes). subscribe(() => {
        this.product!.rating = rating;
        this.product!.votes = votes;

        this.newReviewText = '';
        this.newReviewRating = 5;
      })
    })
  }


  loadSimilarCards(description: string){
    this.dataService.getCards().subscribe(cards => {
      this.similarCards = Object.keys(cards)
        .map(key => ({id: Number(key), ...cards[key] }))
        .filter(card => card.description === description);
    })
  }

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
