const fs = require('fs');
import yargs from 'yargs';
import { plainToClass,classToPlain,serialize } from 'class-transformer';
import {convertPlaylist,getConverterTypes} from "../../convert/convert-playlist";
import {Jspf,Playlist} from "../../entities/models";
import {readFile,writeFile,validateOptionPath,validateOptionFormat} from "../index";

const allowedTypes = getConverterTypes();


type ConvertCommandOptions = {
  path_in:string,
  path_out:string,
  format_in?:string,
  format_out?:string,
  strip?:boolean
}

async function convertCommand(argv: ConvertCommandOptions ) {

  let {
    path_in = '',
    path_out = '',
    format_in = '',
    format_out = '',
    strip = false,
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

  //conversion IN
  const input_data:any = await readFile(path_in);
  let playlistJSON:object;

  try{
    const jspfString = convertPlaylist(input_data,{format_in:format_in,format_out:'jspf'});
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

  if (!strip && !jspf.isValid() ){
    console.info(jspf.validation.errors);
    console.log();
    console.error("Your JSPF is not valid.  Either correct the input file (eg. on https://jsonlint.com/), or use argument ''--strip=true' to strip non-valid values.");
    process.exit();
  }

  //conversion OUT

  let output_data:any = undefined;

  try{
    output_data = convertPlaylist(jspf.toString(),{format_in:'jspf',format_out:format_out});
  }catch(e){
    console.error('Unable to convert data.');
    throw e;
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
      .option('strip', {
        describe: 'Remove values that do not conform to the JSPF specifications',
        type: 'boolean',
        default: true
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
