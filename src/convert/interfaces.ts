import { JspfPlaylistI } from '../entities/interfaces';
import { ZodError } from 'zod';

export interface DataConverterI{
  get(data: string):JspfPlaylistI;
  set(data: JspfPlaylistI):string;
}

// The "static side" of a DataConverter subclass. TypeScript can't express this as
// abstract static members on DataConverter itself, so it's enforced instead where
// converters are registered (see convert/index.ts's `converters` array).
export interface DataConverterStaticI {
  new (): DataConverterI;
  readonly format: string;
  readonly contentType: string;
}

export interface ConvertOptionsI {
  ignoreValidationErrors?: boolean;
  stripInvalid?: boolean;
}

export interface ConvertResult {
  data: JspfPlaylistI | string;
  validationErrors?: ZodError | null;
}
