#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
// @ts-ignore - clear module doesn't have type definitions
import clear from 'clear';
import figlet from 'figlet';

import { REPO_URL, XSPF_URL, JSPF_VERSION, ISSUES_URL } from '../constants';
import { getConverterTypes } from '../convert/index';
import { getPathExtension } from '../utils';

// Read package version
const packageJsonPath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const PACKAGE_VERSION = packageJson.version;

export async function readFile(path: string): Promise<string> {
  try {
    const data = await fs.promises.readFile(path, 'utf8');
    return data;
  } catch (error) {
    console.error('Failed to read input file.');
    throw error;
  }
}

export async function writeFile(path: string, fileData: string): Promise<void> {
  try {
    await fs.promises.writeFile(path, fileData);
  } catch (error) {
    console.error('Failed to write output file.');
    throw error;
  }
}

export function validateOptionFormat(name: string, value: string, path: string):string{

  const allowedTypes = getConverterTypes();

  //if value is not set, try to get it from the file path extension
  if (!value && path){
    value = getPathExtension(path) ?? '';
  }

  if (!value) {
    throw new Error(`❌ Please set a value for --${name}.`);
  }
  if (!allowedTypes.includes(value)) {
    throw new Error(`❌ Invalid value '${value}' for '--${name}'. Available formats: ${allowedTypes.join(', ')}.`);
  }
  return value as string;
}

export function validateOptionPath(name:string,value:string,existsCheck:boolean=false):string{

  if (!value) {
    throw new Error(`❌ Please set a value for --${name}.`);
  }

  if (existsCheck && !fs.existsSync(value)) {
    throw new Error(`❌ The path '${value}' specified in '--${name}' does not exist.`);
  }

  return value as string;
}

async function cli(){

  const allowedTypes = getConverterTypes();

  clear();

  console.log(
    figlet.textSync('JSPF CLI', { horizontalLayout: 'full' })
  );
  console.log(`Version: ${PACKAGE_VERSION}\n`);

  const argv = hideBin(process.argv);
  await yargs(argv)
    .scriptName('jspf-cli')
      .usage('$0 <cmd> [args]')
    .commandDir('./commands')
    .demandCommand(1, 'You need at least one command before moving on')
    .recommendCommands()
    .option('path_in', {
      describe: 'Path to the input file',
      type: 'string',
      alias: 'i',
      demandOption: true
    })
    .option('format_in', {
      describe: `The input format for conversion. If '--path_in' has an extension, this can be omitted.`,
      choices: allowedTypes,
      type: 'string'
    })
    .help('h')
    .alias('h', 'help')
    .epilogue(`JSPF version: ${JSPF_VERSION} - ${XSPF_URL}`)
    .epilogue(`for more information or issues, reach out ${REPO_URL}`)
    .parseAsync();

}

cli().catch((e) => {
  console.error("❌ ERROR");
  console.error(e);
  console.log();
  console.info(`👹 That was a bug. Report it at ${ISSUES_URL}`);
  process.exit(1);
});
