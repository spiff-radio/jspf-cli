import { JspfPlaylistI } from '../entities/interfaces';
import { ZodError } from 'zod';
export interface DataConverterI {
    get(data: string): JspfPlaylistI;
    set(data: JspfPlaylistI): string;
}
export interface ConvertOptionsI {
    ignoreValidationErrors?: boolean;
    stripInvalid?: boolean;
}
export interface ConvertResult {
    data: JspfPlaylistI | string;
    validationErrors?: ZodError | null;
}
