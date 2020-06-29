import { Validators, FormControl, FormArray, AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export class CustomValidators extends Validators {

  static JournalMode(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

      // if (control.value && control.value !== `${parseInt(control.value, 10)}`)
      if(control && control.value > 0 && control.value < 3)
        return null;

      // control.setErrors(error);
      return {
        journalMode: {
          valid: false,
          message: 'You must select either Direct Input or Coefficient Calculation'
        }
      };;
    }
  }

  static ValidateInteger(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const error = {
        notInteger: {
          valid: false,
          message: 'This value must be an integer'
        }
      };

      // if (control.value && control.value !== `${parseInt(control.value, 10)}`)
      if((parseFloat(control.value) == parseInt(control.value)) && !isNaN(control.value))
        return null;

      // control.setErrors(error);
      return error;
    }
  }

  static ValidateMinArrayLength(name: string, title:string, min: number = 0): ValidatorFn {
    return (c: AbstractControl): {[key: string]: any} => {
      const field = c.get(name);

      // console.log(name, field.value.length);
      if (field && field.value.length <= min) {
        field.setErrors({
          minLengthArray: {
            valid: false,
            message: title+' Must have more than ' + min + ' elements'
          }
        });
      }
      return null;
    }
  }

  static ValidateDiameterConstraint(group: FormGroup) {
    // here we have the 'diameters' group
    let ed = group.controls.externalDiameter.value;
    let id = group.controls.internalDiameter.value;
    const internal = group.get('internalDiameter');

    const mode = group.get('mode');
    if (mode && mode.value == 'inertia')
      return null;

    if (ed <= id) {
      internal.setErrors({
        diameterConstraint: {
          valid: false,
          message: 'The external diameter must be greater than the internal diameter'
        }
      });
    }

    return null;
  }

  static ValidateSpinConstraint(group: FormGroup) {
    // here we have the 'diameters' group
    let is = group.controls.initialSpin.value;
    let fs = group.controls.finalSpin.value;
    const final = group.get('finalSpin');

    if (fs <= is) {
      final.setErrors({
        'spinConstraint': {
          valid: false,
          message: 'The final spin must be greater than the initial spin'
        }
      });
    }

    return null;
  }

  static ValidateFrequencyConstraint(group: FormGroup) {
    // here we have the 'diameters' group
    let is = group.controls.initialFrequency.value;
    let fs = group.controls.finalFrequency.value;
    const final = group.get('finalFrequency');

    if (fs <= is) {
      final.setErrors({
        'frequencyConstraint': {
          valid: false,
          message: 'The final frequency must be greater than the initial frequency'
        }
      });
    }

    return null;
  }

  static ValidateLengthConstraint(length: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any } | null => {
      const position = c.get('position');

      if (position.value !== undefined && (isNaN(position.value) || position.value < 0 || position.value > length)) {
        position.setErrors({
          lengthConstraint: {
            valid: false,
            message: 'The position must be in the shaft; Between 0 and ' + length
          }
        });
      }
      return null;
    }
  }

  static ValidatePositive(zero: boolean = true): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let val: number = control.value;

      if (control.pristine || control.pristine) {
        return null;
      }
      if ((zero && val >= 0) || val > 0) {
        return null;
      }
      return {
        'positive': {
          valid: false,
          message: 'The value must be greater than '+(zero ? 'or equal to ' : '')+'0'
        }
      };
    }
  }

  static ValidateMin(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let val: number = control.value;

      if (control.pristine || control.pristine) {
        return null;
      }
      if (val >= min) {
        return null;
      }
      return {
        'min': {
          valid: false,
          message: 'The value must be greater than ' + min
        }
      };
    }
  }

  static ValidateMax(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let val: number = control.value;

      if (control.pristine || control.pristine) {
        return null;
      }
      if (val <= max) {
        return null;
      }
      return { 
        'max': {
          valid: false,
          message: 'The value must be less than ' + max
        }
      };
    }
  }

  static ValidateUrl(control: AbstractControl) {
    if (!control.value.startsWith('https') || !control.value.includes('.io')) {
      return { validUrl: true };
    }
    return null;
  }

  // ribs form group
  // validator: CustomValidators.ValidateRibs()
  static ValidateRibs(formEl: FormGroup) {

    if(!formEl)
      return null;

    console.log(formEl.controls);
    // let controls = arr.controls[0].controls;
    // console.log(controls); 
  }

  // function validateDateTime(fieldKeys: any) {
  //   return (group: FormGroup) => {
  //     for (let i = 0; i < fieldKeys.length; i++) {
  //       let field = group.controls[fieldKeys[i]];
  //       if (typeof field !== 'undefined' && (field.value != '' && field.value != null)) {
  //         if (moment(field.value, environment.customDateTimeFormat.parseInput, false).isValid() == false) {
  //           return field.setErrors({ validateDateTime: true });
  //         }
  //       }
  //     }
  //   }
  // }
}
