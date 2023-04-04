//custom decorator
import { buildMessage, ValidateBy, registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { URL } from 'url';
import ValidatorJS from 'validator';

/**
 * Checks if a given value is a date.
 */
export function isUri(value: any, options?: ValidatorJS.IsURLOptions): boolean {
  return value instanceof URL;
}

/**
 * Checks if a value is a date.
 */
export function IsUri(options?: ValidatorJS.IsURLOptions, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isUri',
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isUri(value, args?.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be an URI', validationOptions),
      },
    },
    validationOptions
  );
}

export function isSinglePropertyObject(value: any): boolean {
  const keys = Object.keys(value);
  return keys.length === 1;
}

export function IsSinglePropertyObject(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isSinglePropertyObject',
      validator: {
        validate: (value, args): boolean => isSinglePropertyObject(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must have a single property defined.', validationOptions),
      },
    },
    validationOptions
  );
}
