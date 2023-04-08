import * as fs from 'fs';
import * as path from 'path';
import { default as _ } from 'lodash'; // Optional, for string manipulation
import merge from 'lodash/merge';

import {PlaylistDataI} from "../entities/jspf/interfaces";
import {Jspf,Playlist} from "../entities/models";
import {JSONValidationErrors} from "../entities/jspf/models";
import { DataConverterI,ConvertOptionsI } from './interfaces';
import JspfConverter from './formats/jspf';
import M3u8Converter from './formats/m3u8';
import XspfConverter from './formats/xspf';

const converters = [JspfConverter, M3u8Converter, XspfConverter];

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

export function convertPlaylist(data_in: any, options: ConvertOptionsI = { format_in: 'auto', format_out: 'auto', ignoreValidationErrors: false }):string {

  //IN
  const converterInClass = getConverterByType(options.format_in);
  const converterIn = new converterInClass();

  //DTO
  const dto:PlaylistDataI = converterIn.get(data_in);

  const jspf = new Jspf();
  jspf.playlist = new Playlist(dto);

  try{
    jspf.isValid();//will eventually throw a JSONValidationErrors
  }catch(e){
    if (e instanceof JSONValidationErrors) {
      if (!options.ignoreValidationErrors){
        throw(e);
      }
    }else{
      throw(e);
    }
  }

  //OUT
  const converterOutClass = getConverterByType(options.format_out);
  const converterOut = new converterOutClass();
  const data_out = converterOut.set(dto);
  return data_out;
}
