import { JSONValidationErrors, JspfPlaylist } from '../entities/models';
import { JspfPlaylistI } from '../entities/interfaces';
import { ConvertOptionsI } from './interfaces';
import JspfConverter from './formats/jspf';
import M3uConverter from './formats/m3u';
import M3u8Converter from './formats/m3u8';
import PlsConverter from './formats/pls';
import XspfConverter from './formats/xspf';

const converters = [JspfConverter, M3uConverter, M3u8Converter, PlsConverter, XspfConverter];

// Get a flat array of all the converter types
export function getConverterTypes(): string[] {
  return converters.map((converter) => converter.type);
}

// Get a converter by a type
export function getConverterByType(type: string) {
  const converter = converters.find(converter => converter.type === type);
  if (converter) {
    return converter;
  } else {
    throw new Error(`Converter with type '${type}' was not found.`);
  }
}

export function importPlaylist(data:string,format:string='jspf',options: ConvertOptionsI = {ignoreValidationErrors: false,stripInvalid:true}):JspfPlaylistI{
  const converterClass = getConverterByType(format);
  const converter = new converterClass();
  const dto:JspfPlaylistI = converter.get(data);

  const playlist = new JspfPlaylist(dto);

  try{
    playlist.isValid();//will eventually throw a JSONValidationErrors
  }catch(e){
    if (e instanceof JSONValidationErrors) {
      if (!options.ignoreValidationErrors){
        throw(e);
      }
    }else{
      throw(e);
    }
  }

  return playlist.toDTO() as JspfPlaylistI;

}

export function exportPlaylist(dto:JspfPlaylistI,format:string='jspf',options: ConvertOptionsI = {ignoreValidationErrors: false,stripInvalid:true}):string{

  const playlist = new JspfPlaylist(dto);

  try{
    playlist.isValid();//will eventually throw a JSONValidationErrors
  }catch(e){
    if (e instanceof JSONValidationErrors) {
      if (!options.ignoreValidationErrors){
        throw(e);
      }
    }else{
      throw(e);
    }
  }

  const converterClass = getConverterByType(format);
  const converter = new converterClass();

  dto = playlist.toDTO() as JspfPlaylistI;
  const data:string = converter.set(dto);
  return data;
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

  const converterClass = getConverterByType(format);
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
