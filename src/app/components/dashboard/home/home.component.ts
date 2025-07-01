import {Component, inject} from '@angular/core';
import {Auth, signOut, user} from "@angular/fire/auth";
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    protected readonly user = user;

    private router = inject(Router)
    private authService = inject(AuthService)


    onSignOut() {
      this.authService.logOut()
        .then(() => this.router.navigate(['/auth/sign-in']))
        .catch(error => console.error('Error occurred:', error))
    }
}
