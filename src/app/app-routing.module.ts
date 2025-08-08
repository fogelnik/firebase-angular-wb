import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WelcomePageComponent} from './components/welcome-page/welcome-page.component';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {ProductComponent} from './components/product/product.component';
import {BasketComponent} from './components/basket/basket.component';



const redirectToLogin = () => redirectUnauthorizedTo('/auth/sign-in')

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module')
      .then(m => m.DashboardModule),
      canActivate: [AuthGuard],
      data: {
        authGuardPipe: redirectToLogin
      }
  },
  {
    path: 'profile',
    component: UserProfileComponent,

    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectToLogin
    }
  },
  {
    path: 'product',
    component: ProductComponent,
  },
  {
    path: 'basket',
    component: BasketComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
