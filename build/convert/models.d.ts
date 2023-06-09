import { JspfPlaylistI } from '../entities/interfaces';
import { DataConverterI } from './interfaces';
export declare abstract class DataConverter implements DataConverterI {
    static readonly types: string[];
    static readonly contentType: string;
    abstract get(data: any): JspfPlaylistI;
    abstract set(dto: JspfPlaylistI): string;
}
