import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
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
        }
      }
      return '';
    };
  }
}
