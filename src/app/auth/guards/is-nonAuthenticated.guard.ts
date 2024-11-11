import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const NonAuthenticatedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.checkAuthStatus().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        // Si no está autenticado, permite el acceso
        return true;
      }
      if (isAuthenticated) {
        // Si está autenticado, redirige a la página de tareas
        router.navigateByUrl('/home/tasks');
        return false;
      }
      return false;
    })
  );
};
