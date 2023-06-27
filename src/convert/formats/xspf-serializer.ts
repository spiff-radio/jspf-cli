import { json2xml } from 'xml-js';
import {XSPF_VERSION,XSPF_XMLNS} from '../../constants';
import { JspfI } from '../../entities/interfaces';
import { JspfPlaylistI } from '../../entities/interfaces';
import { Jspf,JspfPlaylist } from '../../entities/models';

export interface XSPFDataI extends JspfI {
  _declaration?: {
    _attributes?: {
      version?: string;
      encoding?: string;
    };
  };
}

export default function serializeXSPF(playlistData: JspfPlaylistI):string{
  const jspf = new Jspf();
  jspf.playlist = new JspfPlaylist(playlistData);

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
  if (xspfJSON.playlist){
    if (xspfJSON.playlist.track){
      xspfJSON.playlist.trackList = { track: xspfJSON.playlist.track };
      delete xspfJSON.playlist.track;
    }
  }


  // Update some of the single nodes recursively
  updateNodes(xspfJSON.playlist);

  // Use json2xml to convert JspfJson to XML
  const xml: string = json2xml(JSON.stringify(xspfJSON), { compact: true, spaces: 4 });
  return xml;
}

function updateNodes(data: any) {

  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      updateNodes(data[i]);
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

      updateNodes(data[key]);

    }
  }
}

function updateSingle(data:any,type:string){
  if (!data) return;

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
