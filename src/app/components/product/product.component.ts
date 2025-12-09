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

  // loadProducts() {
  //   this.isLoading = true;
  //   this.dataService.getCards().subscribe((data) => {
  //     this.cards = data;
  //     this.filteredCards = data
  //     this.isLoading = false;
  //   })
  // }
  loadProducts(){
    this.isLoading = true;
    this.dataService.getCards().subscribe((data) => {
      this.cards = Object.keys(data).map(key => ({
        id: Number(key),
        ...data[key]
      }));
      this.filteredCards = this.cards;
      this.isLoading = false;
    })
  }


  applyFilter(term: string){
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
    if(card && card.id != null){
      this.router.navigate(['/product', card.id]);
    }else {
      console.error('Card ID is undefined')
    }
  }


  // nextImage(card: Product) {
  //   if (card.images && card.images.length) {
  //     this.currentIndex = (this.currentIndex + 1) % card.images.length;
  //   }
  // }
  //
  // prevImage(card: Product) {
  //   if (card.images && card.images.length) {
  //     this.currentIndex = (this.currentIndex - 1 + card.images.length) % card.images.length;
  //   }
  // }

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
