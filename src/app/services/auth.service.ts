import {inject, Injectable} from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, UserCredential } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);

  constructor(
  ) {
  }
  register(user: Omit<User, 'userLevel'>): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, user.email, user.password))
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe();
  }

  getUserUid(user: User) {
    return this.auth.currentUser?.uid;
  }
}
