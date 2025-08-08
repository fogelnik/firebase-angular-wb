import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { HeaderComponent } from './components/header/header/header.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProductComponent } from './components/product/product.component';
import {HttpClientModule} from '@angular/common/http';
import { BasketComponent } from './components/basket/basket.component';



@NgModule({
  declarations: [
    AppComponent,
    BasketComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FooterComponent,
    HeaderComponent,
    WelcomePageComponent,
    UserProfileComponent,
    ProductComponent,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({ projectId: "training-wb-angular-fire-proj", appId: "1:226524836594:web:5b29537d8839e02304166b", storageBucket: "training-wb-angular-fire-proj.firebasestorage.app", apiKey: "AIzaSyBc4zpfYCTkfOdxzOZ-W6loEDIfXxxmX-A", authDomain: "training-wb-angular-fire-proj.firebaseapp.com", messagingSenderId: "226524836594" })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
