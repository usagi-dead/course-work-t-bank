import { Injectable, inject, NgZone } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null | undefined>(undefined);

  currentUser$ = this.currentUserSubject.asObservable();

  initAuthStateListener() {
    onAuthStateChanged(this.auth, user => {
      this.ngZone.run(() => {
        this.currentUserSubject.next(user);
      });
    });
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    try {
      const result = await signInWithPopup(this.auth, provider);
      await this.router.navigate(['/']);
      return !!result.user;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}