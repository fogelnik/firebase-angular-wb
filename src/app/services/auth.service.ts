import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup, signOut, user, User
} from '@angular/fire/auth';
import {BehaviorSubject} from 'rxjs';

export type UserRole = 'admin' | 'seller' | 'customer' | null;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider();
  private userRole: UserRole = null;
  private sellerEmails = ['fogelnk777@gmail.com', 'kohnik.samp@gmail.com'];
  private adminEmails = ['admin1@gmail.com'];

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user && user.email){
        // this.userRole = this.sellerEmails.includes(user.email) ? "seller" : 'customer';
        this.userRole = this.determineRole(user.email)
      }else {
        this.userRole = null;
      }
    });
  }


  getUserId(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  getUserName(): string {
    return this.auth.currentUser?.displayName
      ?? this.auth.currentUser?.email
      ?? 'Гость';
  }

  private determineRole(email:string): UserRole{
    if(this.adminEmails.includes(email)) return "admin";
    if(this.sellerEmails.includes(email)) return 'seller';
    return 'customer';
  }
  getRole(): UserRole{
    return this.userRole;
  }
  async signInWithEmail(email: string, password: string){
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.userRole = this.determineRole(email);
      return result;
    }catch (error){
      this.userRole = null;
      throw error;
    }
  }
 async signInWithGoogle(){
    const result = await signInWithPopup(this.auth, this.googleProvider);
    const email = result.user.email;

    this.userRole = email ? this.determineRole(email) : 'customer';
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


}
