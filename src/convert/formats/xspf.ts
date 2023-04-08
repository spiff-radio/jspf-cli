import { json2xml } from 'xml-js';
import {XSPF_VERSION,XSPF_XMLNS} from '../../constants';
import { DataConverterI } from '../interfaces';
import { DataConverter } from '../models';
import { JSPFDataI,PlaylistDataI } from '../../entities/jspf/interfaces';
import { Jspf,Playlist } from '../../entities/models';

export interface XSPFDataI extends JSPFDataI {
  _declaration: {
    _attributes: {
      version: string;
      encoding: string;
    };
  };
}

export default class XspfConverter extends DataConverter {
  public static readonly types = ['xspf'];

  public get(data:any):PlaylistDataI{
    throw new Error('XSPF imports not yet implemented.');
  }

  public set(playlistData: PlaylistDataI):string{
    const jspf = new Jspf();
    jspf.playlist = new Playlist(playlistData);

    let xspfJSON: XSPFDataI = {
      //add XML declaration
      _declaration: {
        _attributes: {
          version: "1.0",
          encoding: "utf-8"
        }
      },
      //add playlist attributes
      playlist: {
        ...jspf.playlist,
        _attributes: {
          version: XSPF_VERSION,
          xmlns: XSPF_XMLNS
        }
      }
    };

    // Move tracks within a trackList node
    xspfJSON.playlist.trackList = { track: xspfJSON.playlist.track };
    delete xspfJSON.playlist.track;

    // Update some of the single nodes recursively
    XspfConverter.updateNodes(xspfJSON.playlist);

    // Use json2xml to convert JspfJson to XML
    const xml: string = json2xml(JSON.stringify(xspfJSON), { compact: true, spaces: 4 });
    return xml;

  }

  private static updateNodes(data: any) {

    const updateSingle = (data:any,type:string) => {
      const prop_name:string = Object.keys(data)[0];
      const prop_value:any = data[prop_name];

      switch(type){
        case 'link':

          return {
            _attributes: {
              rel:prop_name,
              href:prop_value
            }
          }

        break;
        case 'meta':

          return {
            _attributes: {
              rel:prop_name,
              content:prop_value
            }
          }

        break;
        case 'extension':
          //TOUFIX
        break;
        case 'attribution':
          //TOUFIX
        break;
        default:
          return data;
      }

    }

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        XspfConverter.updateNodes(data[i]);
      }
    } else if (typeof data === 'object') {
      for (let key in data) {

        //process the content of those nodes
        if (['link', 'meta', 'extension', 'attribution'].includes(key)) {

          if ( Array.isArray(data[key]) ){
            data[key] = data[key].map((item:any) => {return updateSingle(item,key)});
          }else{
            data[key] = updateSingle(data[key],key);
          }

        }

        XspfConverter.updateNodes(data[key]);

      }
    }
  }

}
