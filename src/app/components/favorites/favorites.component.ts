import {Component, OnInit} from '@angular/core';
import {Product} from '../product';
import {FavoritesService} from '../../services/favorites.service';
import {NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-favorites',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit{

  favorites: Product[] = [];
  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
  ) {}

  ngOnInit() {

    this.favoritesService.getFavorites().subscribe(favs => {
      this.favorites = favs;
    })

    // const uid = this.authService.getCurrentUserUid()
    // if(uid){
    //   this.favoritesService.loadFavoritesFromFirebase(uid).subscribe(favs => {
    //     this.favorites = favs || [];
    //   })
    // }
    // this.favorites = this.favoritesService.getFavorites()
  }


}
