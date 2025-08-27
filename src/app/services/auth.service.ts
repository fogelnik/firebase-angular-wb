import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup, signOut, user
} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {ThisReceiver} from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider();


  signInWithEmail(email: string, password: string){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signInWithGoogle(){
    return signInWithPopup(this.auth, this.googleProvider);
  }

  signUpWithEmail(email: string, password: string){
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  resetPassword(email: string){
    return sendPasswordResetEmail(this.auth, email)
  }

  logOut(){
    return signOut(this.auth)
  }

  getCurrentUserEmail(): string | null {
    return this.auth.currentUser?.email ?? null;
  }


  getCurrentUserUid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  // getCurrentUserUid(): Promise<string | null> {
  //   return new Promise(resolve => {
  //     onAuthStateChanged(this.auth, user => {
  //       resolve(user?.uid ?? null);
  //     });
  //   });
  // }

}
