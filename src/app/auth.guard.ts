// auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CanActivateFn } from '@angular/router';

// Create the guard function using CanActivateFn
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()=== 'success') {
    return true;  // Allow access if authenticated
  } else {
    router.navigate(['/login']);  // Redirect to login if not authenticated
    return false;
  }
};
