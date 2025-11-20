import { JspfPlaylistI } from '../entities/interfaces';
import { ConvertOptionsI } from './interfaces';
import JspfConverter from './formats/jspf';
import M3uConverter from './formats/m3u';
import M3u8Converter from './formats/m3u8';
import PlsConverter from './formats/pls';
import XspfConverter from './formats/xspf';
export declare function getConverterTypes(): string[];
export declare function getConverterByType(type: string): typeof JspfConverter | typeof M3uConverter | typeof M3u8Converter | typeof PlsConverter | typeof XspfConverter;
export declare function importPlaylist(data: string, format?: string, options?: ConvertOptionsI): JspfPlaylistI;
export declare function exportPlaylist(dto: JspfPlaylistI, format?: string, options?: ConvertOptionsI): string;
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
export declare function exportPlaylistAsBlob(dto: JspfPlaylistI, format?: string, options?: ConvertOptionsI): Blob | Buffer;
