import {Component, inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {NgForOf, NgIf} from '@angular/common';
import {Auth, onAuthStateChanged} from '@angular/fire/auth';
import {SellerProduct} from '../../seller-product';

@Component({
  selector: 'app-admin-cabinet',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './admin-cabinet.component.html',
  styleUrl: './admin-cabinet.component.scss'
})
export class AdminCabinetComponent implements OnInit {


  products: SellerProduct[] = [];
  private auth = inject(Auth);

  constructor(private dataService: DataService) {
    console.log('СТАРТ: Конструктор AdminCabinetComponent успешно вызван!');
  }

  ngOnInit() {
    // Ждем, пока Firebase подтвердит, что администратор залогинен
    onAuthStateChanged(this.auth, (user) => {
      if(!user){
        console.log('Админ не авторизован');
        return;
      }
      console.log('Админ авторизован, загружаем товары...');
      this.loadProducts();
    });
  }

  loadProducts() {
    this.dataService.getAllSellersProducts().subscribe((products) => {
      this.products = products.filter(p => p.status === 'pending');
      // this.allProducts = products.filter(p => p.status === 'pending')
    })
  }

  approveProduct(product: SellerProduct){
    this.dataService.updateProductStatus(product.sellerId!, product.id!, "approved")
      .subscribe(() => {

        this.dataService.publishToCards(product).subscribe(() => {
          alert('Товар одобрен и опубликован!');

          this.dataService.productPublished$.next();
          this.dataService.pendingChanged$.next();

          this.loadProducts();
        });
      })
  }

  rejectProduct(product: SellerProduct){
    this.dataService.updateProductStatus(product.sellerId!, product.id!, 'rejected')
      .subscribe(() => {
        alert('Товар отклонён');
        this.dataService.pendingChanged$.next();
        this.loadProducts();
    })
  }
}
