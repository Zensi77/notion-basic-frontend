import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { ValidatorService } from '../../services/validator.service';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './register-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private validator = inject(ValidatorService);
  private router = inject(Router);

  constructor() {
    setTimeout(() => {}, 300);
  }

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER'],
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

    if (this.registerForm.valid) {
      this.router.navigate(['/home']);
    }
  }
}
