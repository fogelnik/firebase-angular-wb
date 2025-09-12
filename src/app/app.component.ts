import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {BasketService} from './services/basket.service';
import {Auth, onAuthStateChanged, user} from '@angular/fire/auth';
import {HeaderComponent} from './components/header/header/header.component';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from './components/footer/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'firebase-angular-wb';

  constructor(private auth: Auth, private basketService: BasketService) {}
  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if(user){
        this.basketService.setAuthState(user.uid);
      }else {
        this.basketService.resetAuthState();
      }
    })
  }


}
