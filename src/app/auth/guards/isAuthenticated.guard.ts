import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';

export const isAuthenticatedguard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.checkAuthStatus().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigateByUrl('/auth/login');
        return false;
      }
      if (isAuthenticated) {
        return true;
      }
      return false;
    })
  );
};
