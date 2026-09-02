import { ConverterInfoI, JspfPlaylistI } from '../entities/interfaces';
import { ConvertOptionsI, ConvertResult, DataConverterStaticI } from './interfaces';
export declare function getConvertersList(): ConverterInfoI[];
export declare function getAvailableFormats(): string[];
export declare function getConverterByFormat(type: string): DataConverterStaticI;
export declare function importPlaylist(data: string, format?: string, options?: ConvertOptionsI): JspfPlaylistI;
export declare function importPlaylistWithErrors(data: string, format?: string, options?: ConvertOptionsI): ConvertResult;
export declare function exportPlaylist(dto: JspfPlaylistI, format?: string, options?: ConvertOptionsI): string;
export declare function exportPlaylistWithErrors(dto: JspfPlaylistI, format?: string, options?: ConvertOptionsI): ConvertResult;
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
