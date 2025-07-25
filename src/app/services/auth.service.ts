import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider, sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup, signOut
} from '@angular/fire/auth';


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
    return createUserWithEmailAndPassword(this.auth, email, password);
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
}
