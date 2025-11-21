import {Component, OnInit} from '@angular/core';
import {Product} from '../product';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../services/data.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [
    NgIf
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit{

  product: Product | null = null;

  constructor(
    private route: ActivatedRoute, private dataService: DataService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.dataService.getCardsById(id).subscribe((data) => {
        this.product = data
      })
    }
  }
}
