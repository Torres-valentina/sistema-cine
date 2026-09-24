import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Rol } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.listo;
  return auth.logueado() ? true : router.createUrlTree(['/login']);
};

export const rolGuard = (...roles: Rol[]): CanActivateFn => async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.listo;
  const rol = auth.rol();
  return rol && roles.includes(rol) ? true : router.createUrlTree(['/']);
};