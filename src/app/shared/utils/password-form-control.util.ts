import { ValidatorFn, Validators } from '@angular/forms';
import {
  PASSWORD_COMPLEXITY_PATTERN,
  PASSWORD_MIN_LENGTH,
} from '@ecommerce-ma/shared/validations';

type PasswordValidatorOptions = {
  required?: boolean;
  minLength?: number;
  requireComplexity?: boolean;
};

export function buildPasswordValidators(
  options: PasswordValidatorOptions = {},
): ValidatorFn[] {
  const {
    required = true,
    minLength = PASSWORD_MIN_LENGTH,
    requireComplexity = true,
  } = options;

  const validators: ValidatorFn[] = [];

  if (required) {
    validators.push(Validators.required);
  }

  validators.push(Validators.minLength(minLength));

  if (requireComplexity) {
    validators.push(Validators.pattern(PASSWORD_COMPLEXITY_PATTERN));
  }

  return validators;
}
