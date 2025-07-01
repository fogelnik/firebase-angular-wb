import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  authForm!: FormGroup; //форма является группой реактивных форм



  constructor(private router: Router, private authService: AuthService) {
    this.initForm();
  }

  initForm() {
    this.authForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    if(this.authForm.invalid) return

    const {email, password} = this.authForm.value
    this.authService.signUpWithEmail(email, password)
      .then(() => this.redirectToDashboard())
      .catch(error => console.error('error:', error))
  }

  onSignInWithGoogle() {
    this.authService.signInWithGoogle()
      .then(() => this.redirectToDashboard())
      .catch(error => console.error('error:', error))
  }

  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
