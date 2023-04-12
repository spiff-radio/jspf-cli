import * as fs from 'fs';
import * as path from 'path';
import { default as _ } from 'lodash'; // Optional, for string manipulation
import merge from 'lodash/merge';

import {JspfPlaylistI} from "../entities/jspf/interfaces";
import {Jspf,Playlist} from "../entities/models";
import {JSONValidationErrors} from "../entities/jspf/models";
import JspfConverter from './formats/jspf';
import M3u8Converter from './formats/m3u8';
import PlsConverter from './formats/pls';
import XspfConverter from './formats/xspf';

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
