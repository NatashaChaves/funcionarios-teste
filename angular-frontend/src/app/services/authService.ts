import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseApp = initializeApp(environment.firebase); // seu config do firebase
  private auth = getAuth(this.firebaseApp);
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  async login(email: string, password: string): Promise<string> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('token', token); // opcional
    return token;
  }

  logout(): Promise<void> {
    localStorage.removeItem('token');
    return signOut(this.auth);
  }

   getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
