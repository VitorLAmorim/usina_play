import {inject, Injectable} from '@angular/core';
import {User, UserLevel} from "../models/user.model";
import { AuthService } from './auth.service';
import {Observable, of, throwError, map, BehaviorSubject, switchMap, from} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {doc, Firestore, getDoc, setDoc, updateDoc} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService)
  private _currentUser = new BehaviorSubject<User | null>(null);
  currentUser = this._currentUser.asObservable();

  constructor() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this._currentUser.next(JSON.parse(userJson));
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.authService.login(email, password).pipe(
      switchMap(credentials => {
        return this.getUserData(credentials.user.uid);
      }),
      map(user => {
        if (!user) {
          throw new Error('User not found in database');
        }
        this.setCurrentUser(user);
        return true
      }),
      catchError(error => {
        console.log('Login failed:', error);
        return of(false);
      })
    );
  }

  createUser(user: Omit<User, 'userLevel'>): Observable<User> {
    return this.authService.register(user).pipe(
      switchMap(credentials => {
        const uid = credentials.user.uid;
        const userData: User = {
          email: user.email,
          password: '',
          firstName: user.firstName,
          lastName: user.lastName,
          userLevel: UserLevel.PURPLE
        };

        const userDocRef = doc(this.firestore, 'users', uid);
        return from(setDoc(userDocRef, userData)).pipe(
          map(() => {
            return userData;
          })
        );
      }),
      catchError(error => {
        console.error('User creation failed:', error);
        return throwError(() => new Error('Failed to create user'));
      })
    );
  }

  getCurrentUser(): User | null {
      return this._currentUser.value;
  }

  logout(): Observable<void> {
    this.clearCurrentUser();
    return this.authService.logout();
  }

  updateUserProfile(user: User): Observable<void> {
    const uid = this.authService.getUserUid(user);
    if(!uid) {
      return of();
    }
    const userDocRef = doc(this.firestore, 'users', uid);
    const { ...userData } = user;
    return from(updateDoc(userDocRef, userData));
  }

  setCurrentUser(user: User) {
    this._currentUser.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  clearCurrentUser() {
    this._currentUser.next(null);
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return !!this._currentUser.value;
  }

  private getUserData(uid: string): Observable<User | null> {
    const userDocRef = doc(this.firestore, 'users', uid);
    return from(getDoc(userDocRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data() as User;
          return { ...data };
        } else {
          return null;
        }
      })
    );
  }

}
