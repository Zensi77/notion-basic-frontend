import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import Swal from 'sweetalert2';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((err) => {
      Swal.fire({
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado o no estás logueado.',
        icon: 'error',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(() => {
        router.navigate(['/auth/login']);
      });
      throw err;
    })
  );
};
