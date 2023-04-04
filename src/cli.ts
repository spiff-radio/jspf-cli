#!/usr/bin/env node
const clear = require('clear');
const figlet = require('figlet');

import 'reflect-metadata';
import { plainToClass,classToPlain,serialize } from 'class-transformer';
import { validateSync } from 'class-validator';
import { validationErrorsAsArray } from 'class-validator-flat-formatter';
import {Playlist,Track} from "./class-validator/models";
import jsonSchema from './jsonschema/schema.json';
import {Validator, ValidatorResult, ValidationError, Schema as JSONSchema} from 'jsonschema';


const jspf = {
   "playlist" : {
     "title"         : 125,
     "creator"       : "Name of playlist author",
     "annotation"    : "Super playlist",
     "info"          : "http://example.com/",
     "location"      : "http://example.com/",
     "identifier"    : "http://example.com/",
     "image"         : "http://example.com/",
     "date"          : "2005-01-08T17:10:47-05:00",
     "license"       : "http://example.com/",
     "attribution"   : [
       {"identifier"   : "http://example.com/"},
       {"location"     : "http://example.com/"}
     ],
     "link"          : [
       {"http://example.com/rel/1/" : "http://example.com/body/1/"},
       {"http://example.com/rel/2/" : "http://example.com/body/2/"}
     ],
     "meta"          : [
       {"http://example.com/rel/1/" : "my meta 14"},
       {"http://example.com/rel/2/" : "345"}
     ],
     "extension"     : {
       "http://example.com/app/1/" : ['ARBITRARY_EXTENSION_BODY', 'ARBITRARY_EXTENSION_BODY'],
       "http://example.com/app/2/" : ['ARBITRARY_EXTENSION_BODY']
     },
     "track"         : [
       {
         "location"      : ["http://example.com/1.ogg", "http://example.com/2.mp3"],
         "identifier"    : ["http://example.com/1/", "http://example.com/2/"],
         "title"         : "Track title",
         "creator"       : "Artist name",
         "annotation"    : "Some text",
         "info"          : "http://example.com/",
         "image"         : "http://example.com/",
         "album"         : "Album name",
         "trackNum"      : 1,
         "duration"      : 0,
         "link"          : [
           {"http://example.com/rel/1/" : "http://example.com/body/1/"}
         ],
         "meta"          : [
           {"INVALID" : "my meta 14"},
           {"http://example.com/rel/2/" : "345"}
         ],
         "extension"     : {
           "http://example.com/app/1/" : ['ARBITRARY_EXTENSION_BODY', 'ARBITRARY_EXTENSION_BODY'],
           "http://example.com/app/2/" : ['ARBITRARY_EXTENSION_BODY']
         }
       }
     ]
   }
 }


clear();
console.log(
  figlet.textSync('JSPF', { horizontalLayout: 'full' })
);

/*
const playlist = new Playlist(jspf.playlist);
const playlistErrors = validateSync(playlist);

if (playlistErrors.length > 0) {
  //console.log('PLAYLIST VALIDATION ERROR:', playlistErrors);
  console.log('PLAYLIST VALIDATION ERROR:', validationErrorsAsArray(playlistErrors));
}else{
  console.log("CLASS PLAYLIST",playlist);
}


if (playlist?.track) {
  console.log("TRACK")
  console.log(playlist?.track[0])
}
*/




export class JSPFValidator{
  data:object;
  schema:object;
  validator;
  validation;
  errors:ValidationError[];
  constructor(jspf:object,schema:object){
    this.data = jspf;
    this.schema = schema;
    this.validator = new Validator();
    this.validation = this.validator.validate(this.data,this.schema);
    this.errors = this.validation.errors;
  }

  getValidData(){
    return this.removeInvalidValues();
  }

  private removeInvalidValues():object {
    const data = JSON.parse(JSON.stringify(this.data));//make copy
    this.validation.errors.forEach(error => this.removeValueForError(data,error));
    return data;
  }

  private removeValueForError(data: object, error: ValidationError): object {
    const errorPath = error.property.replace(/\[(\w+)\]/g, '.$1').split('.');
    let currentNode: { [key: string]: any } = data;
    for (let i = 0; i < errorPath.length; i++) {
      const key = errorPath[i];
      if (i === errorPath.length - 1) {
        delete currentNode[key];
      } else {
        if (!currentNode.hasOwnProperty(key)) {
          // Property is not defined in the data, maybe already deleted, move on to next error
          continue;
        }
        currentNode = currentNode[key];
      }
    }
    return data;
  }

}

const jspfValidator = new JSPFValidator(jspf,jsonSchema);
let newJspf = JSON.parse(JSON.stringify(jspf));//make copy

console.log("***INPUT***");
console.log(JSON.stringify(newJspf));

if (jspfValidator.validation.errors){

  console.log("***ERRORS***");
  console.log(jspfValidator.validation.errors);
  console.log("***CLEAN***");
  newJspf = jspfValidator.getValidData();
  console.log(newJspf);
}

console.log(JSON.stringify(newJspf));

console.log("END");
