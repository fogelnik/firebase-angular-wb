import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {Product} from '../product';
import {BasketService} from '../../services/basket.service';
import {QuickViewComponent} from '../quick-view/quick-view.component';
import {SearchService} from '../../services/search.service';



@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  imports: [
    NgForOf,
    NgIf,
    QuickViewComponent,
  ],
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{

  cards: Product[] = [];
  filteredCards: Product[] = []
  isLoading = true;
  private notificationTimeout: any
  notification: string | null = null

  hoveredCard: Product | null = null;
  selectedCard: Product | null = null;
  isQuickViewOpen = false;

  private sliderInterval: any = null;

  allCards: Product[] = []

  // currentIndex = 0;

  constructor(
    private dataService: DataService,
    private router: Router,
    private basketService: BasketService,
    private searchService: SearchService,
  ) {}

  ngOnInit() {
    this.loadProducts();

    this.searchService.searchTerm$.subscribe(term => {
      this.applyFilter(term)
    })
  }


  // loadProducts(){
  //   this.isLoading = true;
  //   this.dataService.getCards().subscribe((data) => {
  //     this.cards = Object.keys(data).map(key => ({
  //       id: Number(key),
  //       ...data[key]
  //     }));
  //     this.filteredCards = this.cards;
  //     this.isLoading = false;
  //   })
  // }

  // loadProducts(){
  //   this.isLoading = true;
  //   this.dataService.getCards().subscribe((data) => {
  //     this.cards = Object.keys(data).map(key => ({
  //       id: Number(key),
  //       ...data[key],
  //       isInCart: false,
  //       currentIndex: 0
  //     }));
  //
  //     this.allCards = [];
  //
  //     this.cards.forEach(card => {
  //       this.allCards.push(card)
  //       if(card.variants && card.variants.length){
  //         card.variants.forEach(variant => {
  //           const variantCard: Product = {
  //             ...card,
  //             id: variant.id,
  //             title: variant.title,
  //             description: variant.description,
  //             imageUrl: variant.imageUrl,
  //             // images: [],
  //             images: variant.imageUrl ? [variant.imageUrl] : [],
  //             price: variant.price || card.price,
  //             color: variant.color,
  //             rating: variant.rating,
  //             votes: variant.votes,
  //             itemCount: card.itemCount,
  //             category: card.category,
  //             variants: [],
  //             isInCart: false,
  //             currentIndex: 0
  //           };
  //           this.allCards.push(variantCard)
  //         })
  //       }
  //     });
  //     this.filteredCards = this.allCards;
  //     this.isLoading = false;
  //   })
  // }
  loadProducts(){
    this.isLoading = true;
    this.dataService.getCards().subscribe((data) => {
      this.cards = Object.keys(data).map(key => {
        const item = data[key];

        const mainImage = (item.images && item.images.length > 0) ? item.images[0] : item.imageUrl;

        return {
          ...item,
          id: Number(key),
          imageUrl: mainImage,
          isInCart: false,
          currentIndex: 0
        };
      });

      this.filteredCards = this.cards;
      this.isLoading = false;
    })
  }


  applyFilter(term: string){
    if(!term){
      this.filteredCards = this.cards
    }else {
      const lowerTerm = term.toLowerCase();
      this.filteredCards = this.cards.filter(card =>
        card.title.toLowerCase().includes(lowerTerm) ||
        card.description.toLowerCase().includes(lowerTerm)
      );
    }
    const lowerTerm = term.toLowerCase();
    this.filteredCards = this.cards.filter(card =>
    card.title.toLowerCase().includes(lowerTerm) || card.description.toLowerCase().includes(lowerTerm)
    );
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
  openQuickView(card: Product){
    this.selectedCard = card;
    this.isQuickViewOpen = true;
  }
  closeQuickView(){
    this.isQuickViewOpen = false;
    this.selectedCard = null;
  }

  openProductDetail(card: Product){
    this.router.navigate(['/product', card.id])
    // this.router.navigate(['/product', card.id], {state: {product: card}});
    //{state: {product: card}}: дополнительно передает объект товара (карточку) в состояние маршрута. Это можно использовать в новом компоненте, чтобы показать детали
  }


  startSlider(card: Product){
    card.currentIndex = 0;
    if(this.sliderInterval) return;

    this.sliderInterval = setInterval(() => {
      if(card.images && card.images.length){
        card.currentIndex = (card.currentIndex! + 1) % card.images.length;
      }
    }, 1000)
  }

  stopSlider() {
    if(this.sliderInterval){
      clearInterval(this.sliderInterval);
      this.sliderInterval = null;
    }
  }
}
