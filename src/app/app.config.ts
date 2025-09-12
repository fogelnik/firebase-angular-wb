import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp({
      projectId: "training-wb-angular-fire-proj",
      appId: "1:226524836594:web:5b29537d8839e02304166b",
      storageBucket: "training-wb-angular-fire-proj.firebasestorage.app",
      apiKey: "AIzaSyBc4zpfYCTkfOdxzOZ-W6loEDIfXxxmX-A",
      authDomain: "training-wb-angular-fire-proj.firebaseapp.com",
      messagingSenderId: "226524836594"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
