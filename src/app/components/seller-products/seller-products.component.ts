import {Component, inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';
import {Product} from '../product';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Auth, onAuthStateChanged, user} from '@angular/fire/auth';
import {SellerProduct} from '../../seller-product';

@Component({
  selector: 'app-seller-products',
  imports: [
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './seller-products.component.html',
  styleUrl: './seller-products.component.scss'
})
export class SellerProductsComponent implements OnInit{

  products: SellerProduct[] = [];
  userId: string | null = null;
  private auth = inject(Auth)

  showDeleteMessage: boolean = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if(!user){
        console.log('Пользователь не авторизован');
        return
      }

      this.dataService.getSellerProducts(user.uid).subscribe((products) => {
        this.products = products;
      })

      // if (user) {
      //   this.dataService.getSellerProducts(user.uid).subscribe((products: SellerProduct[]) => {
      //     this.products = products;
      //   });
      // } else {
      //   console.log('Пользователь не авторизован');
      // }
    });
  }

  deleteSellerProduct(productId: string){
    const userId = this.authService.getCurrentUserUid();
    if(!userId) return;

    this.dataService.deleteSellerProduct(userId, productId).subscribe(() => {
      this.products = this.products.filter(p => p.id !== productId);

      this.showDeleteMessage = true;
      setTimeout(() => this.showDeleteMessage = false, 4000);
    });
  }
}
