const fs = require('fs');
import yargs from 'yargs';
import { plainToClass,classToPlain,serialize } from 'class-transformer';
import {getConverterTypes} from "../../convert/index";
import {JSONValidationErrors,Jspf,Playlist} from "../../entities/models";
import {readFile,writeFile,validateOptionPath,validateOptionFormat} from "../index";

const allowedTypes = getConverterTypes();

type ConvertCommandOptions = {
  path_in:string,
  path_out:string,
  format_in?:string,
  format_out?:string,
  force?:boolean,
  strip?:boolean
}

async function convertCommand(argv: ConvertCommandOptions ) {

  let {
    path_in = '',
    path_out = '',
    format_in = '',
    format_out = '',
    force = false,
    strip=true
  } = argv;

  //Check file paths
  try{
    path_in = validateOptionPath('path_in',path_in,true);
  }catch(e){
    console.log(e);
  }

  try{
    path_out = validateOptionPath('path_out',path_out);
  }catch(e){
    console.log(e);
  }

  //check file formats
  try{
    format_in = validateOptionFormat('format_in',format_in,path_in);
  }catch(e){
    console.log(e);
  }

  try{
    format_out = validateOptionFormat('format_out',format_out,path_out);
  }catch(e){
    console.log(e);
  }

  if (!path_in || !path_out || !format_in || !format_out){
    process.exit();
  }

  ////

  const input_data:any = await readFile(path_in);
  const playlist = new Playlist();

  try{
    playlist.import(input_data,format_in,{
      ignoreValidationErrors:false,//we'll handle this below, in the catch block
      stripInvalid:strip
    });
  }catch(e){
    if (e instanceof JSONValidationErrors) {
      //always log errors
      console.log(e.validation.errors);
      console.log();
      //throw error only if 'force' is not set
      if (!force){
        console.error("The input playlist is not valid, conversion has been stopped.");
        console.log();
        console.error("You can use option '--force=true' to ignore this error.");
        console.log();
        process.exit();
      }
    }else{
      throw(e);
    }
  }

  //conversion OUT
  let output_data:any = undefined;

  try{
    output_data = playlist.export(format_out,{
      ignoreValidationErrors:force,
      stripInvalid:strip
    });
  }catch(e){

    if (e instanceof JSONValidationErrors) {
      console.log(e.validation.errors);
      console.log();
      if (!force){
        console.error("The output playlist is not valid, conversion has been stopped.");
        console.log();
        console.error("You can use option '--force=true' to ignore this error.");
        console.log();
        process.exit();
      }
    }else{
      throw(e);
    }
  }

  //output
  await writeFile(path_out,output_data);

  console.log(`🗸 SUCCESSFULLY CONVERTED FILE! ( ${format_in} > ${format_out})`);
  console.log();
  console.log(path_out);
  console.log();
  process.exit();

}

module.exports = {
  command: 'convert',
  describe: 'Convert a playlist file to another format.',
  builder: (yargs: yargs.Argv) => {
    return yargs
      .option('path_out', {
        describe: 'Path to the output file',
        type: 'string',
        alias: 'o'
      })
      .option('format_out', {
        describe: `The output format for conversion. If '--path_out' has an extension, this can be omitted.`,
        choices: allowedTypes,
        type: 'string'
      })
      .option('force', {
        describe: 'Force conversion even if validation fails. It will also remove values that do not conform to the JSPF specifications',
        type: 'boolean',
        default: false
      })
      /*
      .check((argv) => {
        if (argv.format_in && !allowedTypes.includes(argv.format_in)) {
          throw new Error(`Invalid input format: ${argv.format_in}`);
        }
        if (argv.format_out && !allowedTypes.includes(argv.format_out)) {
          throw new Error(`Invalid output format: ${argv.format_out}`);
        }
        return true;
      });
      */
  },
  handler: convertCommand
};
