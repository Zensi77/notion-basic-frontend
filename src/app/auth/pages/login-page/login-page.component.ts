import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { ValidatorService } from '../../services/validator.service';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  templateUrl: './login-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private validator = inject(ValidatorService);

  public loginForm: FormGroup = this.formBuilder.group({
    email: ['prueba@prueba.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  });

  isValidField(field: string): boolean {
    return this.loginForm.controls[field].touched &&
      !this.loginForm.controls[field].errors
      ? true
      : false;
  }

  message(field: string) {
    this.validator.message(field)(this.loginForm);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.loginForm.valid) {
      this.router.navigate(['/home']);
    }
  }
}
