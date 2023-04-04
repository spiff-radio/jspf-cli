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

import FormatConverter from "./format-converter";
import {Playlist} from "./class-validator/models";
import {DTOPlaylistI} from "./dto/interfaces";
import {DTOPlaylist} from "./dto/models";

type cliOptions = {
  path_input:string,
  path_output:string,
  format_input:FileFormat,
  format_output:FileFormat
  strip?:boolean,
}

const defaultCliOptions:cliOptions = {
  path_input: '/home/gordie/Local Sites/newspiff/modules/jspf-playlist/tests/data/playlist.m3u8',
  path_output: '/home/gordie/Local Sites/newspiff/modules/jspf-playlist/tests/data/playlistOUTPUT.jspf',
  strip:true,
  format_input:'m3u8',
  format_output:'xml'
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

  let options = await yargs.default(defaultCliOptions).argv;

  if (!options?.path_input){
    console.log("❌ Please set a value for --path_input.");

  }

  if (!options?.format_input){
    console.log("❌ Please set a value for --format_input.");

  }

  if (!options?.path_output){
    console.log("❌ Please set a value for --path_output.");

  }

  if (!options?.format_output){
    console.log("❌ Please set a value for --format_input.");

  }

  if (!options?.path_input || !options?.path_output || !options?.format_input || !options?.format_output){
    process.exit();
  }

  //input file

  let input_data:any = await readFile(options.path_input);
  let output_data:any = undefined;

  const converter = new FormatConverter();

  try{
    input_data = converter.import(input_data,options.format_input as FileFormat) as DTOPlaylistI;
  }catch(e){
    console.error('Unable to load data.');
    throw e;
  }

  //DTO model
  const playlist_dto = new DTOPlaylist(input_data);
  input_data = classToPlain(playlist_dto);

  if (!options.strip && !playlist_dto.is_valid() ){
    console.info(playlist_dto.errors);
    console.log();
    console.error("Your JSPF is not valid.  Either correct the input file (eg. on https://jsonlint.com/), or use argument ''--strip=true' to strip non-valid values.");
    process.exit();
  }

  //output
  output_data = converter.export(input_data,options.format_output as FileFormat);
  await writeFile(options.path_output,output_data);

  console.log(`🗸 SUCCESSFULLY CREATED FILE! ( ${options.format_input} > ${options.format_output})`);
  console.log(options.path_output);
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
