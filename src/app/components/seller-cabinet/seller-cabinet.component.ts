import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {DataService} from '../../services/data.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {SellerProduct} from '../../seller-product';


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
  // imagesControls: FormControl[] = [];
  imagesBase64: string[] = [];
  showValidationError: boolean = false;
  showSuccessMessage: boolean = false;
  lastArticle: string = '';

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  showNotification: boolean = false;

  colors: string[] = ['Красный', 'Синий', 'Зеленый', 'Желтый', 'Черный', 'Белый']
  category: string[] = ['Одежда', 'Обувь', 'Электроника', 'Книги', 'Инструменты', 'Мебель']

  private triggerNotification(message: string, type: 'success' | 'error' ){
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 4000);
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    ) {}

  ngOnInit() {
    this.sellerForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      color: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
    })
  }


  handleFiles(files: FileList){
    const fileList = Array.from(files);

    fileList.forEach(file => {
      if(file.type.startsWith('image/')){
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagesBase64.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    })
  }
  onFileDropped(event: DragEvent){
    event.preventDefault();
    if(event.dataTransfer?.files){
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: any){
    if(event.target.files){
      this.handleFiles(event.target.files);
    }
  }

  removeImage(index: number) {
    this.imagesBase64.splice(index, 1);
  }

  isInvalid(controlName: string): boolean{
    const control = this.sellerForm.get(controlName);
    return !!(control && control.invalid && (control.touched || this.showValidationError));
  }

  onSubmit() {
    // Проверяем форму + наличие хотя бы одной картинки
    if (this.sellerForm.invalid || this.imagesBase64.length === 0) {
      this.showValidationError = true;
      this.sellerForm.markAllAsTouched();
      this.triggerNotification('Заполните всю форму', 'error')
      setTimeout(() => (this.showValidationError = false), 3000);
      return;
    }

    const userId = this.authService.getCurrentUserUid();
    // Приставка 'SKU-' поможет визуально отличить артикул от обычного числа
    const generatedArticle = 'SKU' + Date.now();
    this.lastArticle = generatedArticle;

    const product: SellerProduct = {
      ...this.sellerForm.value,
      article: generatedArticle,
      price: +this.sellerForm.value.price,
      images: this.imagesBase64,
      imageUrl: this.imagesBase64[0],
      rating: '0',
      votes: 0,
      itemCount: 1,
      status: 'pending',
      sellerId: userId,
    }

    if (userId) {
      this.dataService.addProduct(userId, product).subscribe(() => {
        this.triggerNotification(`Товар добавлен! Артикул: ${generatedArticle}`, 'success');
        this.sellerForm.reset();
        this.imagesBase64 = []; // Очищаем картинки
      });
    }
  }
}
