import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {BasketService} from '../../../services/basket.service';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  authForm!: FormGroup; //форма является группой реактивных форм

  errorMessage: string = '';
  serverError: string = '';

  showPassword = false;


  get email(): string{
    return this.authForm.controls['email'].value
  }
  get password(): string{
    return this.authForm.controls['password'].value
  }

  constructor(private router: Router, private authService: AuthService, private basketService: BasketService) {
    this.initForm();
  }

  initForm() {
    this.authForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    if(this.authForm.invalid) return;

    const {email, password} = this.authForm.value
    this.authService.signUpWithEmail(email, password)
      .then(userCredential => {
        const uid = userCredential.user.uid;
        this.basketService.setAuthState(uid);
        console.log('user:', uid)
       this.redirectToDashboard();
      })
      .catch(error => {
        // console.error('Email sign-in error:', error);
        if(error instanceof Error){
          if(error.message.includes('auth/invalid-email')){
            this.serverError = 'Некорректная почта';
          }else if(error.message.includes('auth/user-not-found')){
            this.serverError = 'Пользователь не найден';
          }else if(error.message.includes('auth/wrong-password')){
            this.serverError = 'Неверный пароль';
          }else {
            this.serverError = 'Ошибка входа. Попробуйте ещё раз.';
          }
          this.errorMessage = this.serverError;
        }
      })
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword
  }
  clearEmail() {
    this.authForm.get('email')?.setValue('')
  }
  onSignInWithGoogle() {
    this.authService.signInWithGoogle()
      .then(userCredential => {
        const uid = userCredential.user.uid;
        this.basketService.setAuthState(uid);
        console.log('user:', uid)
        this.redirectToDashboard();
      })
      .catch(error => console.error('error:', error))
  }

  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
