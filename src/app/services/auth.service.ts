import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup, signOut, user
} from '@angular/fire/auth';

export type UserRole = 'seller' | 'customer' | null;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider();
  private userRole: UserRole = null;
  private sellerEmails = ['fogelnk777@gmail.com', 'kohnik.samp@gmail.com'];

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user && user.email){
        this.userRole = this.sellerEmails.includes(user.email) ? "seller" : 'customer';
      }else {
        this.userRole = null;
      }
    });
  }


  getRole(): UserRole{
    return this.userRole;
  }
  //
  // signInWithEmail(email: string, password: string){
  //   return signInWithEmailAndPassword(this.auth, email, password);
  // }
  async signInWithEmail(email: string, password: string){
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);

      if(this.sellerEmails.includes(email)){
        this.userRole = 'seller'
      }else {
        this.userRole = 'customer'
      }

      return result
    }catch (error){
      this.userRole = null;
      throw error
    }
  }

 async signInWithGoogle(){
    const result = await signInWithPopup(this.auth, this.googleProvider);
    const email = result.user.email;

    if (email && this.sellerEmails.includes(email)){
      this.userRole = 'seller';
    }else {
      this.userRole = 'customer';
    }
    return result;
  }

  signUpWithEmail(email: string, password: string){
    this.userRole = 'customer'
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  resetPassword(email: string){
    return sendPasswordResetEmail(this.auth, email)
  }

  logOut(){
    this.userRole = null;
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
