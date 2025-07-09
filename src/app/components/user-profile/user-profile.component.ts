import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  userEmail: string | null = null;

  constructor() {
    this.userEmail = this.authService.getCurrentUserEmail();
    this.userEmail = this.userEmail?.split('@')[0] ?? 'Гость'
  }

  private authService = inject(AuthService)
  private router = inject(Router)

  onSignOut() {
    this.authService.logOut()
      .then(() => this.router.navigate(['auth/sign-in']))
      .catch(error => console.error('Error occurred:', error))
  }
}
