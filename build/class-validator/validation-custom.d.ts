import { ValidationOptions } from 'class-validator';
import { IsURLOptions } from 'validator';
/**
 * Checks if a given value is a date.
 */
export declare function isUri(value: any, options?: IsURLOptions): boolean;
/**
 * Checks if a value is a date.
 */
export declare function IsUri(options?: IsURLOptions, validationOptions?: ValidationOptions): PropertyDecorator;
export declare function isSinglePropertyObject(value: any): boolean;
export declare function IsSinglePropertyObject(validationOptions?: ValidationOptions): PropertyDecorator;
