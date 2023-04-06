#!/usr/bin/env node
const fs = require('fs');
import yargs from 'yargs';
const clear = require('clear');
const figlet = require('figlet');
var jsonPackage = require('../package.json');

import {REPO_URL,ISSUES_URL,XSPF_URL,JSPF_VERSION} from './constants';
import {extractPathExtension} from './utils';

import 'reflect-metadata';
import { plainToClass,classToPlain,serialize } from 'class-transformer';
import { validateSync } from 'class-validator';

import {convertPlaylist,getConverterTypes} from "./dto/converters-list";
import {Jspf,Playlist} from "./entities/models";
//import {} from "./entities/models";

type cliOptions = {
  path_in:string,
  path_out:string,
  format_in?:string,
  format_out?:string,
  strip?:boolean
}

const defaultCliOptions:Record<string, any> = {
  //path_in: '/home/gordie/Local Sites/newspiff/modules/jspf-playlist/tests/data/playlist.m3u8',
  //path_in:"/mnt/c/Users/gordiePC/Local Sites/newspiff/modules/jspf-playlist/tests/data/playlist.jspf",
  //path_out: '/home/gordie/Local Sites/newspiff/modules/jspf-playlist/tests/data/playlistOUTPUT.jspf',
  //path_out:"/mnt/c/Users/gordiePC/Local Sites/newspiff/modules/jspf-playlist/tests/data/playlistTEST.m3u8",
  //strip:true
  //format_in:'m3u8',
  //format_out:'jspf'
};


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

  console.info(`Package version: ${jsonPackage.version} - ${REPO_URL}`);
  console.info(`JSPF version: ${JSPF_VERSION} - ${XSPF_URL}`);
  console.log('---');
  console.log();
}


async function cli(){

  const allowedTypes = getConverterTypes();

  clear();

  console.log(
    figlet.textSync('JSPF', { horizontalLayout: 'full' })
  );

  let options = await yargs
  .default(defaultCliOptions)
  .option('path_in', {
    describe: `The input file path.`,
    type: 'string',
    demandOption: true
  })
  .option('path_out', {
    describe: 'The output file path.',
    type: 'string',
    demandOption: true
  })
  .option('format_in', {
    describe: `The input format for conversion.  If '--path_in' has an extension, this can be omitted.`,
    choices:allowedTypes,
    type: 'string'
  })
  .option('format_out', {
    describe: `The output format for conversion.  If '--path_out' has an extension, this can be omitted.`,
    choices:allowedTypes,
    type: 'string'
  })
  .option('strip', {
    describe: 'Remove values that do not conform to the JSPF specifications',
    type: 'string'
  })
  .help('h')
  .alias('h', 'help')
  .epilogue(`JSPF version: ${JSPF_VERSION} - ${XSPF_URL}`)
  .epilogue(`for more information or issues, reach out ${REPO_URL}`)
  .argv;

  const validateOptionPath = (name: string, value: string | null | undefined,existsCheck:boolean=false): string|undefined => {

    if (!value) {
      throw new Error(`❌ Please set a value for --${name}.`);
    }

    if (existsCheck && !fs.existsSync(value)) {
      throw new Error(`❌ The path '${value}' specified in '--${name}' does not exist.`);
    }

    return value;
  }

  const validateOptionFormat = (name: string, value: string | null | undefined, path: string|undefined): string => {

    const options = allowedTypes;

    //if value is not set, try to get it from the file path extension
    if (!value && path){
      value = extractPathExtension(path);
    }

    if (!value) {
      throw new Error(`❌ Please set a value for --${name}.`);
    }
    if (!options.includes(value)) {
      throw new Error(`❌ Invalid value '${value}' for '--${name}'. Available formats: ${options.join(', ')}.`);
    }
    return value;
  }

  //Check file paths
  try{
    options.path_in = validateOptionPath('path_in',options?.path_in,true);
  }catch(e){
    console.log(e);
  }

  try{
    options.path_out = validateOptionPath('path_out',options?.path_out);
  }catch(e){
    console.log(e);
  }

  //check file formats
  try{
    options.format_in = validateOptionFormat('format_in',options?.format_in,options.path_in);
  }catch(e){
    console.log(e);
  }

  try{
    options.format_out = validateOptionFormat('format_out',options?.format_out,options.path_out);
  }catch(e){
    console.log(e);
  }

  if (options.format_in === options.format_out){
    console.log(`❌ Both input and output formats are set to ${options.format_in}!  Don't you want to convert the data ?`);
    options.format_in = undefined;
    options.format_out = undefined;
  }

  if (!options?.path_in || !options?.path_out || !options?.format_in || !options?.format_out){
    process.exit();
  }

  //conversion IN
  const input_data:any = await readFile(options.path_in);
  let playlistJSON:object;

  try{
    const jspfString = convertPlaylist(input_data,{format_in:options.format_in,format_out:'jspf'});
    const jspfJSON = JSON.parse(jspfString);
    playlistJSON = jspfJSON.playlist;
  }catch(e){
    console.error('Unable to load data.');
    throw e;
  }

  //DTO
  const jspf = new Jspf();
  jspf.playlist = new Playlist(playlistJSON);

  //validation
  if (!options.strip && !jspf.playlist.is_valid() ){
    console.info(jspf.playlist.validation.errors);
    console.log();
    console.error("Your JSPF is not valid.  Either correct the input file (eg. on https://jsonlint.com/), or use argument ''--strip=true' to strip non-valid values.");
    process.exit();
  }

  //conversion OUT

  let output_data:any = undefined;

  try{
    output_data = convertPlaylist(jspf.toString(),{format_in:'jspf',format_out:options.format_out});
  }catch(e){
    console.error('Unable to convert data.');
    throw e;
  }

  //output
  await writeFile(options.path_out,output_data);

  console.log(`🗸 SUCCESSFULLY CONVERTED FILE! ( ${options.format_in} > ${options.format_out})`);
  console.log();
  console.log(options.path_out);
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
