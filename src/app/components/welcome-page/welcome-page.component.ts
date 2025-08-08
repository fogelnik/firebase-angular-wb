import { Component } from '@angular/core';
import {ProductComponent} from '../product/product.component';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  templateUrl: './welcome-page.component.html',
  imports: [
    ProductComponent
  ],
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {

}
