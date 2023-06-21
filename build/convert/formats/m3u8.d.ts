import { DataConverter } from '../models';
import { JspfPlaylistI } from '../../entities/interfaces';
export default class M3u8Converter extends DataConverter {
    static readonly types: string[];
    get(input: string): JspfPlaylistI;
    set(dto: JspfPlaylistI): string;
}
