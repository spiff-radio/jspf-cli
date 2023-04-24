import yargs from 'yargs';
import {JSPF_SPECS_URL} from '../../constants';
import {getPathFilename} from '../../utils';
import {PlaylistI} from "../../entities/interfaces";
import {Jspf,Playlist} from "../../entities/models";
import {getConverterTypes,importPlaylist} from "../../convert/index";
import {readFile,validateOptionPath,validateOptionFormat} from "../index";

type ValidateCommandOptions = {
  path_in:string,
  format_in?:string
}

async function validateCommand(argv: ValidateCommandOptions ) {
  let {
    path_in = '',
    format_in = ''
  } = argv;

  //Check file paths
  try{
    path_in = validateOptionPath('path_in',path_in,true);
  }catch(e){
    console.log(e);
  }

  //check file formats
  try{
    format_in = validateOptionFormat('format_in',format_in,path_in);
  }catch(e){
    console.log(e);
  }

  if (!path_in || !format_in){
    process.exit();
  }

  //conversion IN
  const input_data:any = await readFile(path_in);
  let dto:PlaylistI = {}

  try{
    dto = importPlaylist(input_data,format_in);

  }catch(e){
    console.error('Unable to load data.');
    throw e;
  }

  const playlist = new Playlist(dto);

  //validation
  const fileName:string = getPathFilename(path_in);

  if (!playlist.isValid() ){
    console.info(playlist.validation.errors);
    console.log();
    console.error(`Your playlist '${fileName}' is not valid.  Check the JSPF specs here: ${JSPF_SPECS_URL}`);

  }else{
    console.error(`Congratulations, your playlist '${fileName}' is valid!  ...Sometimes, life is beautiful!`);

  }

  process.exit();

}

module.exports = {
  command: 'validate',
  describe: 'Validate a playlist file against the JSPF specifications.',
  builder: (yargs: yargs.Argv) => {
    return yargs
  },
  handler: validateCommand
};
