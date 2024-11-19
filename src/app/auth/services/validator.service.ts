import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  private _http = inject(HttpClient);

  isValidField(field: string, form: FormGroup) {
    // Retorna si el campo tiene errores y ha sido tocado
    return form.controls[field].errors && form.controls[field].touched;
  }

  // Retorna una función que recibe los 2 campos a comparar y retorna si son iguales o no
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

  // Validador asíncrono que retorna una función que recibe un control(mail input) y escucha los cambios, estableciendo el error
  validateEmail(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const url = environment.user_base_url + '/check-email';
      const email = control.value;

      return this._http
        .get<boolean>(url, {
          // Paso el email como query param al ser get si fuera post sería en el body como un objeto {email}
          params: { email },
        })
        .pipe(
          debounceTime(10000), // Espera para lanzar la petición y no petar el servidor
          map((res) => (res ? null : { emailTaken: true })) // Falso si el email ya está en uso
        );
    };
  }

  // Retorna un mensaje de error según el tipo de error que tenga el campo
  message(field: string) {
    return (formGroup: FormGroup) => {
      if (!formGroup.get(field)) return;

      const errors = formGroup.controls[field].errors ?? null;
      if (!errors) return;

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
