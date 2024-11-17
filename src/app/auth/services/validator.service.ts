import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService implements AsyncValidator {
  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }
  private _http = inject(HttpClient);

  isValidField(field: string, form: FormGroup) {
    // Retorna si el campo tiene errores y ha sido tocado
    return form.controls[field].errors && form.controls[field].touched;
  }

  isFieldMatch(field1: string, field2: string) {
    return (formGroup: FormGroup) => {
      const value1 = formGroup.get(field1)?.value;
      const value2 = formGroup.get(field2)?.value;

      if (value1 !== value2) {
        formGroup.get(field2)?.setErrors({ noMatch: true });
        return { noMatch: true };
      } else {
        formGroup.get(field2)?.setErrors(null);
        return null;
      }
    };
  }

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this._http
      .post<boolean>('http://localhost:3000/users/validate', control.value)
      .pipe(
        debounceTime(1000), // Espera para lanzar la petición y no petar el servidor
        map((res) => (res ? null : { emailTaken: true })) // Falso si el email ya está en uso
      );
    // No uso subscribe porque no quiero suscribirme a la petición, sino devolver el observable para que escuche el formulario
  }

  message(field: string) {
    return (formGroup: FormGroup) => {
      if (!formGroup.get(field)) return;

      const errors = formGroup.controls[field].errors ?? null;
      if (!errors) return;
      console.log(errors);

      for (const key of Object.keys(errors)) {
        switch (key) {
          case 'required':
            return 'El campo es requerido';
          case 'minlength':
            return 'El campo debe tener al menos 6 caracteres';
          case 'email':
            return 'El campo debe ser un email válido';
          case 'emailTaken':
            return 'El email ya está en uso';
        }
      }
      return '';
    };
  }
}
