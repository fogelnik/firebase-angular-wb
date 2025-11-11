import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../product';

@Component({
  selector: 'app-card-page',
  standalone: true,
  imports: [],
  templateUrl: './card-page.component.html',
  styleUrl: './card-page.component.scss'
})
export class CardPageComponent {

  product: Product[] | undefined

  router = inject(Router)
}
