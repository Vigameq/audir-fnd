import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()=== 'success') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};


export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const role = authService.getCurrentRole();
    if (!role) {
      router.navigate(['/dashboard']);
      return false;
    }
    if (role === 'Admin' || allowedRoles.includes(role)) {
      return true;
    }
    router.navigate(['/dashboard']);
    return false;
  };
};
