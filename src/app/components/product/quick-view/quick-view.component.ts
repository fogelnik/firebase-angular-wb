import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from '../../product';


@Component({
  selector: 'app-quick-view',
  imports: [],
  templateUrl: './quick-view.component.html',
  styleUrl: './quick-view.component.scss'
})
export class QuickViewComponent {
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>()
}
