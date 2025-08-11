import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {BasketService} from './services/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent{
  title = 'firebase-angular-wb';

}
