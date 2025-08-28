import { Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage), canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'test',
    loadComponent: () => import('./test/test.component').then(m => m.TestComponent)
  },
  {
    path: 'test-fix',
    loadComponent: () => import('./test-firebase-fix').then(m => m.TestFixComponent)
  },
];
