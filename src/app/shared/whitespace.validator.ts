import { AbstractControl, ValidationErrors } from '@angular/forms';
  
export class WhitespaceValidator {
    static notEmpty(control: AbstractControl) : ValidationErrors | null {
        return control.value.trim() === '' ? {notEmpty: true} : null;
    }
}