import { JspfPlaylistI } from '../../entities/interfaces';
import { DataConverter } from '../models';
export default class JspfConverter extends DataConverter {
    static readonly type = "jspf";
    static readonly contentType = "application/jspf+json;charset=utf-8";
    get(data: string): JspfPlaylistI;
    set(playlistData: JspfPlaylistI): string;
}
