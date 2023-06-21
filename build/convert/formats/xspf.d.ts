import { DataConverter } from '../models';
import { JspfPlaylistI } from '../../entities/interfaces';
export default class XspfConverter extends DataConverter {
    static readonly types: string[];
    get(data: string): JspfPlaylistI;
    set(data: JspfPlaylistI): string;
}
