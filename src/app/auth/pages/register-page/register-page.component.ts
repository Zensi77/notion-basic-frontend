import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { ValidatorService } from '../../services/validator.service';
import { MaterialModule } from '../../../material/material.module';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './register-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private validator = inject(ValidatorService);
  private router = inject(Router);
  private authService = inject(AuthService);

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.validator.validateEmail()],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      // Validaciones a nivel de formulario
      validators: this.validator.isFieldMatch('password', 'password2'),
    }
  );

  isValidField(field: string) {
    return this.validator.isValidField(field, this.registerForm);
  }

  message(field: string) {
    return this.validator.message(field)(this.registerForm);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // al marcar todos los campos como tocados, se muestran los errores
      return;
    }
  }

  register() {
    const { name, email, password } = this.registerForm.value;
    this.authService.register({ name, email, password }).subscribe({
      // retorna el user sin el password, lo cojo del formulario
      next: ({ email }) => {
        this.authService.login(email, password).subscribe({
          next: () => {
            Swal.fire('', 'Usuario registrado correctamente', 'success').then(
              () => {
                this.router.navigate(['/']);
              }
            );
          },
          error: (err: Error) => {
            Swal.fire('Error', 'No se ha podido iniciar sesión', 'error');
          },
        });
      },
      error: (err: Error) => {
        Swal.fire('Error', 'No se ha podido registrar el usuario', 'error');
      },
    });
  }
}
