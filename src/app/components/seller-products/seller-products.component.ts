import {Component, inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';
import {Product} from '../product';
import {NgForOf, NgIf} from '@angular/common';
import {Auth, onAuthStateChanged} from '@angular/fire/auth';

@Component({
  selector: 'app-seller-products',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './seller-products.component.html',
  styleUrl: './seller-products.component.scss'
})
export class SellerProductsComponent implements OnInit{

  products: Product[] = [];
  userId: string | null = null;
  private auth = inject(Auth)

  constructor(
    private dataService: DataService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if(user){
        this.dataService.getSellerProducts(user.uid).subscribe(products => {
          this.products = products;
        })
      }else {
        console.log('Пользователь не авторизован');
      }
    })
  }

  deleteSellerProduct(productId: any){
    const userId = this.authService.getCurrentUserUid();
    if(userId && productId){
      this.dataService.deleteSellerProduct(userId, productId).subscribe(() => {
        this.products = this.products.filter(p => p.id !== productId);
        alert('Товар удален')
      })
    }
  }

}
