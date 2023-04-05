import { json2xml } from 'xml-js';
import {XSPF_VERSION,XSPF_XMLNS} from '../../constants';
import { DTOPlaylistI, DTOConverterI } from '../interfaces';
import { DTOConverter } from '../models';

export default class XspfConverter extends DTOConverter {
  public static readonly types = ['xspf'];

  public get(data:any):DTOPlaylistI{
    throw new Error('XSPF imports not yet implemented.');
  }

  public set(dto: DTOPlaylistI):string{
    throw new Error('XSPF exports not yet implemented.');
  }
  /*
  public setOLD(dto: DTOPlaylistI):string{

    let data = dto as {}

    //add XML declaration
    data = {
      _declaration:{
        _attributes:{
          version:"1.0",
          encoding:"utf-8"
        },
        ...data
    }

    //add playlist attributes - move in PlaylistXML ?
    data.playlist = {
      ...data.playlist,
      _attributes: {
        version: XSPF_VERSION,
        xmlns: XSPF_XMLNS
      }
    };

    //move tracks within a trackList node
    data.playlist.trackList = {track:this.playlist.track};
    delete data.playlist.track;

    //update some of the single nodes recursively
    XspfConverter.updateNodes(data.playlist);

    const xml = json2xml(JSON.stringify(data), { compact: true, spaces: 4 });
    return xml;
  }
  */
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
