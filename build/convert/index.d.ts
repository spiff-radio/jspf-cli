/// <reference types="node" />
import { JspfPlaylistI } from "../entities/interfaces";
import JspfConverter from './formats/jspf';
import M3uConverter from './formats/m3u';
import M3u8Converter from './formats/m3u8';
import PlsConverter from './formats/pls';
import XspfConverter from './formats/xspf';
import { ConvertOptionsI } from "./interfaces";
export declare function getConverterTypes(): string[];
export declare function getConverterByType(type: string): typeof JspfConverter | typeof M3uConverter | typeof M3u8Converter | typeof PlsConverter | typeof XspfConverter;
export declare function importPlaylist(data: string, format?: string, options?: ConvertOptionsI): JspfPlaylistI;
export declare function exportPlaylist(dto: JspfPlaylistI, format?: string, options?: ConvertOptionsI): string;
export declare function exportPlaylistAsBlob(dto: JspfPlaylistI, format?: string, options?: ConvertOptionsI): Blob;
