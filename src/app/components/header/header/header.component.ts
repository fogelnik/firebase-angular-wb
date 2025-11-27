import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Auth, onAuthStateChanged, user} from '@angular/fire/auth';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {BasketService} from '../../../services/basket.service';
import {BasketComponent} from '../../basket/basket.component';
import {FormsModule} from '@angular/forms';
import {SearchService} from '../../../services/search.service';


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

  constructor(
    private auth: Auth,
    private router: Router,
    private basketService: BasketService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.isAuthenticated = !!user;
    })
  }

  onSearch(event: Event){
    const value = (event.target as HTMLInputElement).value;
    this.searchService.setSearchTerm(value)
  }

  get count(): number{
    return this.basketService.getItemCount()
  }

  navigateUser(){
    if(this.isAuthenticated){
      this.router.navigate(['profile']);
    }else {
      this.router.navigate(['auth/sign-in']);
    }
  }

  navigateBasket(){
    this.router.navigate(['basket'])
  }

  navigateToWelcomePage(){
    this.router.navigate(['/'])
  }
}
