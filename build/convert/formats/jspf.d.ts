import { JspfPlaylistI } from '../../entities/interfaces';
import { DataConverter } from '../models';
export default class JspfConverter extends DataConverter {
    static readonly types: string[];
    get(data: string): JspfPlaylistI;
    set(playlistData: JspfPlaylistI): string;
}
