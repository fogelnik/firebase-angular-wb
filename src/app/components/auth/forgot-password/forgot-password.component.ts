import {Component, inject} from '@angular/core';
import {Auth, sendPasswordResetEmail} from '@angular/fire/auth';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  auth = inject(Auth);

  errorMessage: string = '';
  router = inject(Router)
  isPasswordResetEmailSent: boolean = false;

  form!: FormGroup;
  constructor() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    if(this.form.invalid)
      return;

    sendPasswordResetEmail(this.auth, this.form.value.email)
      .then(response => {
        this.isPasswordResetEmailSent = true
      })
      .catch(error => {

      })
  }

}
