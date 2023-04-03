import { buildMessage, ValidateBy, registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

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
