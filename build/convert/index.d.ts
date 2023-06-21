import { JspfPlaylistI } from "../entities/interfaces";
import JspfConverter from './formats/jspf';
import { ConvertOptionsI } from "./interfaces";
export declare function getConverterTypes(): string[];
export declare function getConverterByType(type: string): typeof JspfConverter;
export declare function importPlaylist(data: string, format?: string, options?: ConvertOptionsI): JspfPlaylistI;
export declare function exportPlaylist(dto: JspfPlaylistI, format?: string, options?: ConvertOptionsI): string;
