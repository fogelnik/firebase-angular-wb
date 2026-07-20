import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Auth, onAuthStateChanged, user} from '@angular/fire/auth';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {BasketService} from '../../../services/basket.service';
import {BasketComponent} from '../../basket/basket.component';
import {FormsModule} from '@angular/forms';
import {SearchService} from '../../../services/search.service';
import {ThisReceiver} from '@angular/compiler';


@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    NgIf,
    RouterLink,
    FormsModule
  ],
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  isAuthenticated: boolean = false;
  isAdmin = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private basketService: BasketService,
    private searchService: SearchService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.isAuthenticated = !!user;

      const role = this.authService.getRole();
      this.isAdmin = role === 'admin';
    })
  }

  navigateAdmin() {
    this.router.navigate(['/admin-cabinet'])
  }

  navigateUser(){
    this.isAuthenticated
      ? this.router.navigate(['profile'])
      : this.router.navigate(['auth/sign-in']);

    // if(this.isAuthenticated){
    //   this.router.navigate(['profile']);
    // }else {
    //   this.router.navigate(['auth/sign-in']);
    // }
  }

  navigateBasket(){
    const role = this.authService.getRole();

    role === 'seller'
      ? this.router.navigate(['/seller-products'])
      : this.router.navigate(['basket'])

    // if(role === "seller"){
    //   this.router.navigate(['/seller-products']);
    // }else {
    //   this.router.navigate(['basket'])
    // }
  }

  handleCabinetClick(){

    const role = this.authService.getRole();
    role === 'seller'
      ? this.router.navigate(['seller'])
      : this.router.navigate(['orders']);

    // if(this.authService.getRole() === 'seller'){
    //   this.router.navigate(['seller']);
    // }else {
    //   this.router.navigate(['orders']);
    // }
  }

  onSearch(event: Event){
    const value = (event.target as HTMLInputElement).value;
    this.searchService.setSearchTerm(value)
  }

  get count(): number{
    return this.basketService.getItemCount()
  }

  navigateToWelcomePage(){
    this.router.navigate(['/'])
  }

  goToFavorite(){
    this.router.navigate(['/favorites'])
  }



}
