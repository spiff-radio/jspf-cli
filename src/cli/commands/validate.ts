import yargs from 'yargs';

import { JSPF_SPECS_URL } from '../../constants';
import { getPathFilename } from '../../utils';
import { JspfPlaylistI } from '../../entities/interfaces';
import { JspfPlaylist, JSONValidationErrors } from '../../entities/models';
import { getConverterTypes, importPlaylist } from '../../convert/index';
import { readFile, validateOptionPath, validateOptionFormat } from '../index';

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
    console.error(e);
    process.exit(1);
  }

  //check file formats
  try{
    format_in = validateOptionFormat('format_in',format_in,path_in);
  }catch(e){
    console.error(e);
    process.exit(1);
  }

  if (!path_in || !format_in){
    process.exit(1);
  }

  //conversion IN
  const input_data: string = await readFile(path_in);
  let dto: JspfPlaylistI = {}

  try{
    dto = importPlaylist(input_data,format_in,{
      ignoreValidationErrors:true
    });
  }catch(e){
    console.error('Unable to load data.');
    throw e;
  }

  const playlist = new JspfPlaylist(dto);

  //validation
  const fileName:string = getPathFilename(path_in);

  try{
    playlist.isValid();//will eventually throw a JSONValidationErrors
  }catch(e){
    if (e instanceof JSONValidationErrors) {
      console.info(e.validation.errors);
      console.log();
      console.error(`Your playlist '${fileName}' is not valid.  Check the JSPF specs here: ${JSPF_SPECS_URL}`);
      console.log();
      process.exit(1);
    }else{
      throw(e);
    }
  }

  console.log(`Congratulations, your playlist '${fileName}' is valid!  ...Sometimes, life is beautiful!`);
  console.log();
  process.exit(0);

}

module.exports = {
  command: 'validate',
  describe: 'Validate a playlist file against the JSPF specifications.',
  builder: (yargs: yargs.Argv) => {
    return yargs
  },
  handler: validateCommand
};
