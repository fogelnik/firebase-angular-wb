import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {BasketService} from '../../services/basket.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  userEmail: string | null = null;

  constructor(private basketService: BasketService) {
    this.userEmail = this.authService.getCurrentUserEmail();
    this.userEmail = this.userEmail?.split('@')[0] ?? 'Гость'
  }

  private authService = inject(AuthService)
  private router = inject(Router)


  onSignOut() {
    this.authService.logOut()
      .then(() => {
        this.basketService.isAuthenticated = false;
        this.router.navigate(['auth/sign-in'])
        console.log('isAuthenticated:', this.basketService.isAuthenticated)
      })
      .catch(error => console.error('Error occurred:', error))
  }
}
