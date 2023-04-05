import * as fs from 'fs';
import * as path from 'path';
import { default as _ } from 'lodash'; // Optional, for string manipulation
import merge from 'lodash/merge';

import { DTOConverterI,ConvertOptionsI } from './interfaces';
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

const defaultConvertOptions: ConvertOptionsI = {
  format_in: 'jspf',
  format_out: 'jspf',
};

export function convertPlaylist(data_in: any, options: ConvertOptionsI = defaultConvertOptions):string {

  options = merge(defaultConvertOptions, options);

  const converterInClass = getConverterByType(options.format_in);
  const converterIn = new converterInClass();
  const dto = converterIn.get(data_in);

  const converterOutClass = getConverterByType(options.format_out);
  const converterOut = new converterOutClass();
  const data_out = converterOut.set(dto);
  return data_out;
}
