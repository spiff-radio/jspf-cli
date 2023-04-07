#!/usr/bin/env node
import yargs from 'yargs';
import 'reflect-metadata';
const fs = require('fs');
const clear = require('clear');
const figlet = require('figlet');


import {REPO_URL,ISSUES_URL,XSPF_URL,JSPF_VERSION} from '../constants';
import {getConverterTypes} from "../convert/convert-playlist";
import {Jspf,Playlist,Track,Link} from "../entities/models";

export async function readFile(path: string): Promise<string> {
  try {
    const data = await fs.promises.readFile(path, 'utf8');
    return data;
  } catch (error) {
    console.error('Failed to read input file.');
    throw error;
  }
}

export async function writeFile(path: string, fileData: any): Promise<void> {
  try {
    await fs.promises.writeFile(path, fileData);
  } catch (error) {
    console.error('Failed to write output file.');
    throw error;
  }
}

async function cli(){

  const allowedTypes = getConverterTypes();

  clear();

  console.log(
    figlet.textSync('JSPF CLI', { horizontalLayout: 'full' })
  );

  await yargs
    .scriptName('jspf-cli')
      .usage('$0 <cmd> [args]')
    .commandDir('./commands')
    .demandCommand(1, 'You need at least one command before moving on')
    .recommendCommands()
    .help('h')
    .alias('h', 'help')
    .epilogue(`JSPF version: ${JSPF_VERSION} - ${XSPF_URL}`)
    .epilogue(`for more information or issues, reach out ${REPO_URL}`)
    .argv;

}

cli().catch((e) => {
  console.error("❌ ERROR");
  console.error(e);
  console.log();
  console.info(`👹 That was a bug. Report it at ${ISSUES_URL}`);
  process.exit();
});
