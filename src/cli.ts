#!/usr/bin/env node
const fs = require('fs');
import yargs from 'yargs';
const clear = require('clear');
const figlet = require('figlet');
var jsonPackage = require('../package.json');

import {REPO_URL,ISSUES_URL,XSPF_URL,JSPF_VERSION} from './constants';

import 'reflect-metadata';
import { plainToClass,classToPlain,serialize } from 'class-transformer';
import { validateSync } from 'class-validator';
import { validationErrorsAsArray } from 'class-validator-flat-formatter';

import {convertPlaylist,getConverterTypes} from "./dto/converters-list";
import {DTOPlaylistI} from "./dto/interfaces";
import {DTOPlaylist} from "./dto/models";

type cliOptions = {
  path_in:string,
  path_out:string,
  format_in:string,
  format_out:string,
  strip?:boolean
}

const defaultCliOptions:Record<string, any> = {
  //path_in: '/home/gordie/Local Sites/newspiff/modules/jspf-playlist/tests/data/playlist.m3u8',
  //path_out: '/home/gordie/Local Sites/newspiff/modules/jspf-playlist/tests/data/playlistOUTPUT.jspf',
  strip:true
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
    describe: 'The input file path',
    type: 'string',
    demandOption: true
  })
  .option('path_out', {
    describe: 'The output file path',
    type: 'string',
    demandOption: true
  })
  .option('format_in', {
    describe: `The input format`,
    choices:allowedTypes,
    type: 'string',
    demandOption: true
  })
  .option('format_out', {
    describe: 'The output format',
    choices:allowedTypes,
    type: 'string',
    demandOption: true
  })
  .option('strip', {
    describe: 'Remove values that do not conform to the JSPF specifications',
    type: 'string',
    demandOption: true
  })
  .help('h')
  .alias('h', 'help')
  .epilogue(`JSPF version: ${JSPF_VERSION} - ${XSPF_URL}`)
  .epilogue(`for more information or issues, reach out ${REPO_URL}`)
  .argv;




  const validateOptionFormat = (optionName: string, optionValue: string|undefined): string => {

    const options = allowedTypes;

    if (!optionValue) {
      throw new Error(`❌ Please set a value for ${optionName}.`);
    }
    if (!options.includes(optionValue)) {
      throw new Error(`❌ Invalid value '${optionValue}' for '${optionName}'. Available formats: ${options.join(', ')}.`);
    }
    return optionValue;
  }

  //Check file paths
  if (!options?.path_in){
    console.log("❌ Please set a value for --path_in.");

  }

  if (!options?.path_out){
    console.log("❌ Please set a value for --path_out.");

  }

  //check file formats
  try{
    options.format_in = validateOptionFormat('--format_in',options?.format_in);
  }catch(e){
    console.log(e);
  }

  try{
    options.format_out = validateOptionFormat('--format_out',options?.format_out);
  }catch(e){
    console.log(e);
  }

  if (!options?.path_in || !options?.path_out || !options?.format_in || !options?.format_out){
    process.exit();
  }

  //conversion IN
  const input_data:any = await readFile(options.path_in);
  let jspf_string:string;

  try{
    jspf_string = convertPlaylist(input_data,{format_in:options.format_in,format_out:'jspf'});
  }catch(e){
    console.error('Unable to load data.');
    throw e;
  }

  //DTO
  const playlist_dto = new DTOPlaylist(JSON.parse(jspf_string));

  //validation
  if (!options.strip && !playlist_dto.is_valid() ){
    console.info(playlist_dto.errors);
    console.log();
    console.error("Your JSPF is not valid.  Either correct the input file (eg. on https://jsonlint.com/), or use argument ''--strip=true' to strip non-valid values.");
    process.exit();
  }

  //conversion OUT

  let output_data:any = undefined;
  try{
    output_data = convertPlaylist(playlist_dto.toString(),{format_in:'jspf',format_out:options.format_out});
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
