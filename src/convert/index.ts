import { ZodError } from 'zod';
import { ZodValidationError, JspfPlaylist } from '../entities/models';
import { ConverterInfoI,JspfPlaylistI } from '../entities/interfaces';
import { ConvertOptionsI, ConvertResult, DataConverterStaticI } from './interfaces';
import { stripInvalidPaths } from '../utils';
import JspfConverter from './formats/jspf';
import M3uConverter from './formats/m3u';
import M3u8Converter from './formats/m3u8';
import PlsConverter from './formats/pls';
import XspfConverter from './formats/xspf';

// Typing this list against DataConverterStaticI is what enforces the `format`/`contentType`
// contract: a converter missing either one fails to compile here instead of failing at runtime.
const converters: DataConverterStaticI[] = [JspfConverter, M3uConverter, M3u8Converter, PlsConverter, XspfConverter];

export function getConvertersList(): ConverterInfoI[] {
  if (!Array.isArray(converters)) return [];

  return converters.map(converter => ({
    format: converter.format,
    name: converter.name
  }));
}

export function getAvailableFormats(): string[] {
  if (!Array.isArray(converters)) return [];
  return converters.map(converter => converter.format);
}

// Get a converter by a type
export function getConverterByFormat(type: string) {
  const converter = converters.find(converter => converter.format === type);
  if (converter) {
    return converter;
  } else {
    throw new Error(`Converter with type '${type}' was not found.`);
  }
}

export function importPlaylist(data:string,format:string='jspf',options: ConvertOptionsI = {ignoreValidationErrors: false,stripInvalid:true}):JspfPlaylistI{
  return importPlaylistWithErrors(data, format, options).data as JspfPlaylistI;
}

export function importPlaylistWithErrors(data:string,format:string='jspf',options: ConvertOptionsI = {ignoreValidationErrors: false,stripInvalid:true}):ConvertResult{
  const converterClass = getConverterByFormat(format);
  const converter = new converterClass();
  const dto:JspfPlaylistI = converter.get(data);

  const { playlist, validationErrors } = validateAndClean(new JspfPlaylist(dto), dto, options);

  return {
    data: playlist.toDTO() as JspfPlaylistI,
    validationErrors
  };
}

export function exportPlaylist(dto:JspfPlaylistI,format:string='jspf',options: ConvertOptionsI = {ignoreValidationErrors: false,stripInvalid:true}):string{
  return exportPlaylistWithErrors(dto, format, options).data as string;
}

export function exportPlaylistWithErrors(dto:JspfPlaylistI,format:string='jspf',options: ConvertOptionsI = {ignoreValidationErrors: false,stripInvalid:true}):ConvertResult{

  const { playlist, validationErrors } = validateAndClean(new JspfPlaylist(dto), dto, options);

  const converterClass = getConverterByFormat(format);
  const converter = new converterClass();

  const data:string = converter.set(playlist.toDTO() as JspfPlaylistI);

  return {
    data: data,
    validationErrors
  };
}

// Shared by import/export: if the playlist is invalid and `stripInvalid` is set, rebuild it
// from a copy with the offending paths removed (see stripInvalidPaths) instead of the raw
// data - the original error is still reported so the caller knows what was dropped.
function validateAndClean(playlist: JspfPlaylist, dto: JspfPlaylistI, options: ConvertOptionsI): { playlist: JspfPlaylist; validationErrors: ZodError | null } {
  const validationErrors = playlist.getValidationErrors();
  if (!validationErrors) {
    return { playlist, validationErrors: null };
  }

  if (options.stripInvalid) {
    const strippedDto = stripInvalidPaths(dto, validationErrors.issues);
    const cleaned = new JspfPlaylist(strippedDto);
    const remainingErrors = cleaned.getValidationErrors();
    if (remainingErrors && !options.ignoreValidationErrors) {
      throw new ZodValidationError('Validation failed', remainingErrors);
    }
    return { playlist: cleaned, validationErrors };
  }

  if (!options.ignoreValidationErrors) {
    throw new ZodValidationError('Validation failed', validationErrors);
  }
  return { playlist, validationErrors };
}

/**
 * Export playlist as a Blob-like object (for browser environments).
 * Note: In Node.js environments where Blob is not available, this returns a Buffer instead.
 * For Node.js usage, consider using exportPlaylist() directly and handling the string result.
 *
 * @param dto - The playlist data transfer object
 * @param format - The output format (default: 'jspf')
 * @param options - Conversion options
 * @returns Blob in browser environments, Buffer in Node.js environments without Blob support
 */
export function exportPlaylistAsBlob(dto:JspfPlaylistI,format:string='jspf',options: ConvertOptionsI = {ignoreValidationErrors: false,stripInvalid:true}):Blob | Buffer{

  const converterClass = getConverterByFormat(format);
  let blobString:string = exportPlaylist(dto,format,options);

  // Check if we're in a Node.js environment without Blob support
  if (typeof Blob === 'undefined') {
    // Node.js environment - return Buffer instead
    // Buffer is available in all Node.js versions
    return Buffer.from(blobString, 'utf8');
  }

  // Browser environment or Node.js 18+ - use native Blob
  let blob = new Blob([blobString], {
    type: converterClass.contentType
  });

  return blob;
}
