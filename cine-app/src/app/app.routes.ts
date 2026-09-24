import { Routes } from '@angular/router';
import { rolGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro').then(m => m.Registro) },
  {
    path: 'admin',
    canActivate: [rolGuard('admin')],
    loadComponent: () => import('./pages/admin/admin').then(m => m.Admin),
  },
  { path: '**', redirectTo: '' },
];