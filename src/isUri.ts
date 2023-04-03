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


/*
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';

interface Options {
    each?: boolean;
}

export function StringOrNull({ each }: Options = {}) {

    @ValidatorConstraint({ name: 'isUri', async: false })
    class StringOrNull implements ValidatorConstraintInterface {

        validate(nullableStringList: string | null | (string | null)[], args: ValidationArguments) {
            return !each
                ? isString(it) || isNull(it)
                : isArray(nullableStringList) && nullableStringList.every(it => isString(it) || isNull(it));
        }

        defaultMessage(args: ValidationArguments) {
            return each ? '($value) is not an array of strings or nulls' : '($value) is not a string or null';
        }

    }

    return Validate(StringOrNull);
}
*/
