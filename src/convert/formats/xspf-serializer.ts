import { json2xml } from 'xml-js';

import { XSPF_VERSION, XSPF_XMLNS } from '../../constants';
import { JspfI, JspfPlaylistI, JspfAttributionI, JspfExtensionI } from '../../entities/interfaces';
import { Jspf, JspfPlaylist } from '../../entities/models';

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
      ...jspf.playlist.toDTO(),
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

      //link/meta: arrays of single-key {rel: value} pairs -> repeated sibling elements with attributes
      if (['link', 'meta'].includes(key)) {
        if ( Array.isArray(data[key]) ){
          data[key] = data[key].map((item:any) => {return updateSingle(item,key)});
        }else{
          data[key] = updateSingle(data[key],key);
        }
      }

      //attribution: an array of single-key {location|identifier: value} pairs -> one <attribution>
      //wrapper element whose children are the location/identifier tags themselves
      else if (key === 'attribution' && Array.isArray(data[key])) {
        data[key] = buildAttributionNode(data[key]);
      }

      //extension: a single {applicationUri: [rawNode]} map -> one or more sibling <extension> elements
      else if (key === 'extension' && data[key] && !Array.isArray(data[key])) {
        data[key] = buildExtensionNodes(data[key]);
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
    default:
      return data;
  }

}

// Attribution is a single <attribution> element whose children are, in order,
// the <location>/<identifier> tags themselves (not attributes on <attribution>).
// Group by tag name since xml-js compact form needs an array for repeated siblings.
function buildAttributionNode(items: JspfAttributionI[]): Record<string, any> {
  const grouped: Record<string, any[]> = {};

  items.forEach((item) => {
    const tagName = Object.keys(item)[0];
    if (!tagName) return;
    if (!grouped[tagName]) grouped[tagName] = [];
    grouped[tagName].push({ _text: item[tagName] });
  });

  const node: Record<string, any> = {};
  for (const [tagName, values] of Object.entries(grouped)) {
    node[tagName] = values.length === 1 ? values[0] : values;
  }
  return node;
}

// Extension is one or more sibling <extension application="..."> elements, each
// carrying back the raw child nodes captured on import (application attribute stripped).
function buildExtensionNodes(data: JspfExtensionI): any[] | undefined {
  const nodes = Object.entries(data).map(([application, value]) => ({
    ...(Array.isArray(value) ? value[0] : value),
    _attributes: { application }
  }));
  return nodes.length ? nodes : undefined;
}
