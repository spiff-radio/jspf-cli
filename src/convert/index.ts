import * as fs from 'fs';
import * as path from 'path';
import { default as _ } from 'lodash'; // Optional, for string manipulation
import merge from 'lodash/merge';

import {JSONValidationErrors,JspfPlaylist} from "../entities/models";
import {JspfPlaylistI} from "../entities/interfaces";
import JspfConverter from './formats/jspf';
import M3u8Converter from './formats/m3u8';
import PlsConverter from './formats/pls';
import XspfConverter from './formats/xspf';
import {ConvertOptionsI} from "./interfaces";

const converters = [JspfConverter, M3u8Converter, PlsConverter, XspfConverter];

// Get a flat array of all the converter types
export function getConverterTypes(): string[] {
  return converters.flatMap((converter) => converter.types);
}

// Get a converter by a type
export function getConverterByType(type: string) {
  const converter = converters.find(converter => converter.types.includes(type));
  if (converter) {
    return converter;
  } else {
    throw new Error(`Converter with type '${type}' was not found.`);
  }
}

export function importPlaylist(data:string,format:string='jspf',options: ConvertOptionsI = {ignoreValidationErrors: false,stripInvalid:true}):JspfPlaylistI{
  const converterClass = getConverterByType(format);
  const converter = new converterClass();
  const dto:JspfPlaylistI = converter.get(data);

  const playlist = new JspfPlaylist(dto);

  try{
    playlist.isValid();//will eventually throw a JSONValidationErrors
  }catch(e){
    if (e instanceof JSONValidationErrors) {
      if (!options.ignoreValidationErrors){
        throw(e);
      }
    }else{
      throw(e);
    }
  }

  return playlist.toDTO() as JspfPlaylistI;

}

export function exportPlaylist(dto:JspfPlaylistI,format:string='jspf',options: ConvertOptionsI = {ignoreValidationErrors: false,stripInvalid:true}):string{

  const playlist = new JspfPlaylist(dto);

  try{
    playlist.isValid();//will eventually throw a JSONValidationErrors
  }catch(e){
    if (e instanceof JSONValidationErrors) {
      if (!options.ignoreValidationErrors){
        throw(e);
      }
    }else{
      throw(e);
    }
  }

  const converterClass = getConverterByType(format);
  const converter = new converterClass();

  dto = playlist.toDTO() as JspfPlaylistI;
  const data:string = converter.set(dto);
  return data;
}
