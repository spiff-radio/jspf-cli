import yargs from 'yargs';
import {JSPF_SPECS_URL} from '../../constants';
import {getPathFilename} from '../../utils';
import {Jspf,Playlist} from "../../entities/models";
import {convertPlaylist,getConverterTypes} from "../../convert/convert-playlist";
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
  const fileName:string = getPathFilename(path_in);

  if (!jspf.isValid() ){
    console.info(jspf.validation.errors);
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
