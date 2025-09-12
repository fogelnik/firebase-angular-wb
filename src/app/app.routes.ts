import { Routes } from '@angular/router';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProductComponent } from './components/product/product.component';
import { BasketComponent } from './components/basket/basket.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { HomeComponent } from './components/dashboard/home/home.component';

const redirectToLogin = () => redirectUnauthorizedTo('/auth/sign-in');

export const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  {
    path: 'auth',
    children: [
      { path: '', component: SignInComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent }
    ]
  },
  {
    path: 'dashboard',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin }
  },
  { path: 'product', component: ProductComponent },
  { path: 'basket', component: BasketComponent }
];
