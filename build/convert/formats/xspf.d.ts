import { DataConverter } from '../models';
import { JspfPlaylistI } from '../../entities/interfaces';
export default class XspfConverter extends DataConverter {
    static readonly type = "xspf";
    static readonly contentType = "application/xspf+xml;charset=utf-8";
    get(data: string): JspfPlaylistI;
    set(data: JspfPlaylistI): string;
}
