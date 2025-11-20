import { JspfPlaylistI } from '../../entities/interfaces';
import { DataConverter } from '../models';
export default class PlsConverter extends DataConverter {
    static readonly type = "pls";
    static readonly contentType = "audio/x-scpls";
    get(input: string): JspfPlaylistI;
    set(dto: JspfPlaylistI): string;
}
