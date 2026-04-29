import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {DataService} from '../../services/data.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';


@Component({
  selector: 'app-seller-cabinet',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './seller-cabinet.component.html',
  styleUrl: './seller-cabinet.component.scss'
})
export class SellerCabinetComponent implements OnInit{

  sellerForm!: FormGroup;
  imagesControls: FormControl[] = [];
  showValidationError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    ) {}

  ngOnInit() {
    this.sellerForm = this.fb.group({
      title: ['', Validators.required],
      article: ['', Validators.required],
      category: ['', Validators.required],
      color: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
    })
  }

  isInvalid(controlName: string): boolean{
    const control = this.sellerForm.get(controlName);
    return !!(control && control.invalid && (control.touched || this.showValidationError));

  }
  addImage() {
    const control = new FormControl('', Validators.required);
    this.imagesControls.push(control);
    this.sellerForm.addControl(`images${this.imagesControls.length - 1}`, control)
  }
  removeImage(i:number){
    this.sellerForm.removeControl(`images${i}`);
    this.imagesControls.splice(i, 1);
  }

  onSubmit(){

    if(this.sellerForm.invalid){
      this.showValidationError = true;
      this.sellerForm.markAllAsTouched();
      setTimeout(() => this.showValidationError = false, 3000);
      return;
    }
    this.showValidationError = false;

    const images = this.imagesControls
      .map(c => c.value.trim())
      .filter(value => value != '');

    const userId = this.authService.getCurrentUserUid();

    const product: any = {
      title: this.sellerForm.value.title,
      article: this.sellerForm.value.article,
      category: this.sellerForm.value.category,
      color: this.sellerForm.value.color,
      price: +this.sellerForm.value.price,
      description: this.sellerForm.value.description,
      images: images,
      imageUrl: images[0],
      rating: '0',
      votes: 0,
      itemCount: 1,
    }

    if (userId){
      this.dataService.addProduct(userId, product).subscribe(() => {
        alert('Товар успешно добавлен!');
        this.sellerForm.reset();
        this.imagesControls = [];
        this.showValidationError = false;
      })
    }else{
      alert('Ошибка: пользователь не авторизован');
    }
  }
}
