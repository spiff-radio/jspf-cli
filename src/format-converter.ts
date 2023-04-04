import {FileFormat} from './constants';
import {classToPlain} from 'class-transformer';
import {JSPF_VERSION,XSPF_VERSION,XSPF_XMLNS} from './constants';
import { json2xml } from 'xml-js';


export default class FormatConverter{

  public import(data_input:any,format:FileFormat){

    switch (format as FileFormat) {
      case 'm3u8':
        return this.import_m3u8(data_input);
      break;
      case 'xml':
      break;
      case 'json':
      default:
          return this.import_json(data_input);
        break;
    }

  }

  private import_json(data_input:any){
    try{
      return JSON.parse(data_input);
    }catch(e){
      console.error('Unable to parse JSON.');
      throw e;
    }
  }

  private import_m3u8(data_input:any){
    console.log("INPUT",data_input);
  }

  public export(playlist:any,format:FileFormat){

    const dto = classToPlain(playlist);
    let output_data;

    switch (format as FileFormat) {
      case 'xml':
        return this.export_xml(dto);
        break;
      case 'json':
      default:
        return this.export_json(dto);
        break;
    }
    return output_data;
  }

  private export_json(dto:any){
    try{
      return JSON.stringify(dto);
    }catch(e){
      throw e;
    }
  }

  private export_xml(dto:any){
    const playlistXML = new PlaylistXML(dto);
    let data = classToPlain(playlistXML);

    //add XML declaration

    //add playlist attributes
    data.playlist = {
      ...data.playlist,
      _attributes: {
        version: XSPF_VERSION,
        xmlns: XSPF_XMLNS
      }
    };


    const xml = json2xml(JSON.stringify(data), { compact: true, spaces: 4 });
    return xml;
  }


}

class PlaylistXML{
  _declaration:object = {
    _attributes:{
      version:"1.0",
      encoding:"utf-8"
    }
  }
  playlist:any;

  constructor(dto:any) {

    this.playlist = dto;

    //move tracks within a trackList node
    this.playlist.trackList = {track:this.playlist.track};
    delete this.playlist.track;

    //update some of the single nodes recursively
    this.updateNodes(this.playlist);

  }

  //TOUFIX. This should be better coded if it was within a transform function used with class-transform.
  updateNodes(data: any) {

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
        this.updateNodes(data[i]);
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

        this.updateNodes(data[key]);

      }
    }
  }

}
