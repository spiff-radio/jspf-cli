import yargs from 'yargs';

type ValidateCommandOptions = {
  path:string
}

const defaultCliOptions:Record<string, any> = {
  //path_in: '/home/gordie/Local Sites/newspiff/modules/jspf-cli/tests/data/playlist.m3u8',
  //path_in:"/mnt/c/Users/gordiePC/Local Sites/newspiff/modules/jspf-cli/tests/data/playlist.jspf",
  //path_out: '/home/gordie/Local Sites/newspiff/modules/jspf-cli/tests/data/playlistOUTPUT.jspf',
  //path_out:"/mnt/c/Users/gordiePC/Local Sites/newspiff/modules/jspf-cli/tests/data/playlistTEST.m3u8",
  //strip:true
  //format_in:'m3u8',
  //format_out:'jspf'
};

async function validateCommand(argv: ValidateCommandOptions){
  console.log("VALIDATE YO");
}

module.exports = {
  command: 'validate',
  describe: 'Validate a JSPF file',
  builder: (yargs: yargs.Argv) => {
    return yargs
      .option('path', {
        describe: 'The file path to validate.',
        type: 'string',
        demandOption: true,
        default:'',
        //default: 'home/gordie/Local Sites/newspiff/modules/jspf-cli/tests/data/playlist.m3u8'
      })
      .default(defaultCliOptions);
  },
  handler: validateCommand
};
