import { JspfPlaylistI } from '../entities/interfaces';
import { DataConverterI } from './interfaces';
export declare abstract class DataConverter implements DataConverterI {
    abstract get(data: any): JspfPlaylistI;
    abstract set(dto: JspfPlaylistI): string;
}
