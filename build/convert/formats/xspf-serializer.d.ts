import { JspfI } from '../../entities/interfaces';
import { JspfPlaylistI } from '../../entities/interfaces';
export interface XSPFDataI extends JspfI {
    _declaration?: {
        _attributes?: {
            version?: string;
            encoding?: string;
        };
    };
}
export default function serializeXSPF(playlistData: JspfPlaylistI): string;
