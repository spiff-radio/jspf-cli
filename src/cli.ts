#!/usr/bin/env node
const fs = require('fs');
import yargs from 'yargs';
const clear = require('clear');
const figlet = require('figlet');
var jsonPackage = require('../package.json');

import {REPO_URL,ISSUES_URL,XSPF_URL,JSPF_VERSION,FileFormat} from './constants';

import 'reflect-metadata';
import { plainToClass,classToPlain,serialize } from 'class-transformer';
import { validateSync } from 'class-validator';
import { validationErrorsAsArray } from 'class-validator-flat-formatter';


import JSPFSchemaValidator from "./schema-validator";
import {Playlist} from "./class-validator/models";


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
       {INVALID : "345"}
     ],
     "extension"     : {
       "http://example.com/app/1/" : ["ARBITRARY_EXTENSION_BODY", "ARBITRARY_EXTENSION_BODY"],
       "http://example.com/app/2/" : ["ARBITRARY_EXTENSION_BODY"]
     },
     "track"         : [
       {
         "location"      : ["http://example.com/1.ogg", "http://example.com/2.mp3"],
         "identifier"    : ["http://example.com/1/", "http://example.com/2/"],
         "title"         : 125,
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
           {"http://example.com/rel/1/" : "my meta 14"},
           {"http://example.com/rel/2/" : "345"}
         ],
         "extension"     : {
           "http://example.com/app/1/" : ["ARBITRARY_EXTENSION_BODY", "ARBITRARY_EXTENSION_BODY"],
           "http://example.com/app/2/" : ["ARBITRARY_EXTENSION_BODY"]
         }
       }
     ]
   }
 }




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


/*
const jspfValidator = new JSPFValidator(jspf,jsonSchema);
let newJspf = JSON.parse(JSON.stringify(jspf));//make copy

console.log("***INPUT***");
console.log(JSON.stringify(newJspf));

if (jspfValidator.errors){

  console.log("***ERRORS***");
  console.log(jspfValidator.errors);
  console.log("***CLEAN***");
  newJspf = jspfValidator.getValidData();
  console.log(newJspf);
}

console.log(JSON.stringify(newJspf));

console.log("END");
*/

async function readFile(path: string): Promise<string> {
  try {
    const data = await fs.promises.readFile(path, 'utf8');
    return data;
  } catch (error) {
    console.error('Failed to read input file.');
    throw error;
  }
}

async function writeFile(path: string, fileData: any): Promise<void> {
  try {
    await fs.promises.writeFile(path, fileData);
  } catch (error) {
    console.error('Failed to write output file.');
    throw error;
  }
}

function getCliHeaders(){
  console.log(
    figlet.textSync('JSPF', { horizontalLayout: 'full' })
  );
  console.info(`PACKAGE VERSION: ${jsonPackage.version}`);
  console.info(REPO_URL);
  console.log();
  console.info(`JSPF VERSION: ${JSPF_VERSION}`);
  console.info(XSPF_URL);
  console.log();
  console.log();
}


async function cli(){
  clear();
  getCliHeaders();

  let options = await yargs.default({
    input: '/home/gordie/Bureau/test.jspf',
    output: '/home/gordie/Bureau/testFIX.jspf',
    strip:true,
    format:'xml'
  }).argv;

  if (!options?.input){
    console.log("❌ Please set a value for --input.");

  }

  if (!options?.output){
    console.log("❌ Please set a value for --output.");

  }

  if (!options?.input || !options?.output){
    process.exit();
  }

  const input_data:string = await readFile(options.input);
  let json:object = {};
  let output_data:any = undefined;

  try{
    json = JSON.parse(input_data);
  }catch(e){
    console.error('Unable to parse JSON.');
    throw e;
  }

  const jspfValidator = new JSPFSchemaValidator(json);

  if (!options.strip){
    if (jspfValidator.errors){
      console.error("Your JSPF is not valid.  Either correct the input file (eg. on https://jsonlint.com/), or use argument ''--strip=true' to strip non-valid values.");
      process.exit();
    }
  }else{
    json = jspfValidator.getValidData();
  }

  const playlist = new Playlist(json);

  switch (options.format as FileFormat) {
    case 'xml':
      output_data = playlist.toXML(json);
      break;
    case 'json':
    default:
      output_data = JSON.stringify(json);
      break;
  }

  await writeFile(options.output,output_data);

  console.log("🗸 SUCCESSFULLY CREATED FILE!");
  console.log(options.output);
  console.log();
  process.exit();

}

cli().catch((e) => {
  console.error("❌ ERROR");
  console.error(e);
  console.log();
  console.info(`👹 That was a bug. Report it at ${ISSUES_URL}`);
  process.exit();
});
