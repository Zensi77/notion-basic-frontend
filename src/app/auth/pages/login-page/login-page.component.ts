import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { ValidatorService } from '../../services/validator.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { error } from 'console';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './login-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  router = inject(Router);
  private _formBuilder = inject(FormBuilder);
  private _validator = inject(ValidatorService);
  private _authService = inject(AuthService);

  public hide = signal(true);

  public loginForm: FormGroup = this._formBuilder.group({
    email: ['juanma@gmail.com', [Validators.required, Validators.email]],
    password: ['juanma', [Validators.required, Validators.minLength(6)]],
  });

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  isValidField(field: string) {
    return this._validator.isValidField(field, this.loginForm);
  }

  message(field: string) {
    return this._validator.message(field)(this.loginForm);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this._authService.login(email, password).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => Swal.fire('Error', 'Credenciales incorrectas', 'error'),
      });
    }
  }
}
