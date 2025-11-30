import yargs from 'yargs';

import { getConverterTypes, importPlaylistWithErrors, exportPlaylistWithErrors } from '../../convert/index';
import { JspfPlaylistI } from '../../entities/interfaces';
import { ZodValidationError } from '../../entities/models';
import { readFile, writeFile, validateOptionPath, validateOptionFormat } from '../index';

const allowedTypes = getConverterTypes();

type ConvertCommandOptions = {
  path_in:string,
  path_out:string,
  format_in?:string,
  format_out?:string,
  strict?:boolean,
  stripInvalid?:boolean,
  quiet?:boolean
}

async function convertCommand(argv: ConvertCommandOptions ) {

  let {
    path_in = '',
    path_out = '',
    format_in = '',
    format_out = '',
    strict = false,
    stripInvalid = true,
    quiet = false
  } = argv;

  //Check file paths
  try{
    path_in = validateOptionPath('path_in',path_in,true);
  }catch(e){
    console.error(e);
    process.exit(1);
  }

  try{
    path_out = validateOptionPath('path_out',path_out);
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

  try{
    format_out = validateOptionFormat('format_out',format_out,path_out);
  }catch(e){
    console.error(e);
    process.exit(1);
  }

  if (!path_in || !path_out || !format_in || !format_out){
    process.exit(1);
  }

  ////

  const input_data: string = await readFile(path_in);
  let dto: JspfPlaylistI = {}

  try{
    const result = importPlaylistWithErrors(input_data,format_in,{
      ignoreValidationErrors:!strict, // Default: ignore errors (show warnings), strict: abort
      stripInvalid:stripInvalid
    });
    
    dto = result.data as JspfPlaylistI;
    
    // Show warnings if validation errors exist and not quiet
    if (result.validationErrors && !quiet) {
      console.warn("⚠️  Validation warnings for input playlist:");
      
      // Group warnings by type
      const groupedWarnings = new Map<string, string[]>();
      result.validationErrors.issues.forEach(issue => {
        const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
        const key = issue.message;
        if (!groupedWarnings.has(key)) {
          groupedWarnings.set(key, []);
        }
        groupedWarnings.get(key)!.push(path);
      });
      
      // Display grouped warnings
      groupedWarnings.forEach((paths, message) => {
        if (paths.length === 1) {
          console.warn(`  - ${paths[0]}: ${message}`);
        } else {
          console.warn(`  - ${paths.length} fields: ${message}`);
          // Show first few examples
          const examples = paths.slice(0, 3);
          examples.forEach(path => {
            console.warn(`    • ${path}`);
          });
          if (paths.length > 3) {
            console.warn(`    ... and ${paths.length - 3} more`);
          }
        }
      });
      console.log();
    }
  }catch(e){
    if (e instanceof ZodValidationError) {
      // Abort only if --strict is set
      if (strict){
        console.error("❌ The input playlist is not valid, conversion has been stopped.");
        if (!quiet) {
          console.error("Validation errors:");
          e.errors.issues.forEach(issue => {
            const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
            console.error(`  - ${path}: ${issue.message}`);
          });
        }
        console.log();
        console.error("Remove '--strict' to continue with warnings.");
        console.log();
        process.exit(1);
      }else{
        // This shouldn't happen in default mode, but handle it anyway
        throw(e);
      }
    }else{
      throw(e);
    }
  }

  //conversion OUT
  let output_data: string | undefined = undefined;

  try{
    const result = exportPlaylistWithErrors(dto,format_out,{
      ignoreValidationErrors:!strict, // Default: ignore errors (show warnings), strict: abort
      stripInvalid:stripInvalid
    });
    
    output_data = result.data as string;
    
    // Show warnings if validation errors exist and not quiet
    if (result.validationErrors && !quiet) {
      console.warn("⚠️  Validation warnings for output playlist:");
      
      // Group warnings by type
      const groupedWarnings = new Map<string, string[]>();
      result.validationErrors.issues.forEach(issue => {
        const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
        const key = issue.message;
        if (!groupedWarnings.has(key)) {
          groupedWarnings.set(key, []);
        }
        groupedWarnings.get(key)!.push(path);
      });
      
      // Display grouped warnings
      groupedWarnings.forEach((paths, message) => {
        if (paths.length === 1) {
          console.warn(`  - ${paths[0]}: ${message}`);
        } else {
          console.warn(`  - ${paths.length} fields: ${message}`);
          // Show first few examples
          const examples = paths.slice(0, 3);
          examples.forEach(path => {
            console.warn(`    • ${path}`);
          });
          if (paths.length > 3) {
            console.warn(`    ... and ${paths.length - 3} more`);
          }
        }
      });
      console.log();
    }
  }catch(e){

    if (e instanceof ZodValidationError) {
      // Abort only if --strict is set
      if (strict){
        console.error("❌ The output playlist is not valid, conversion has been stopped.");
        if (!quiet) {
          console.error("Validation errors:");
          e.errors.issues.forEach(issue => {
            const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
            console.error(`  - ${path}: ${issue.message}`);
          });
        }
        console.log();
        console.error("Remove '--strict' to continue with warnings.");
        console.log();
        process.exit(1);
      }else{
        // This shouldn't happen in default mode, but handle it anyway
        throw(e);
      }
    }else{
      throw(e);
    }
  }

  if (!output_data) {
    console.error("Failed to generate output data.");
    process.exit(1);
  }

  //output
  await writeFile(path_out,output_data);

  console.log(`🗸 SUCCESSFULLY CONVERTED FILE! ( ${format_in} > ${format_out})`);
  console.log();
  console.log(path_out);
  console.log();
  process.exit(0);

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
      .option('strict', {
        describe: 'Abort conversion if validation fails. By default, conversion continues with warnings.',
        type: 'boolean',
        default: false
      })
      .option('strip-invalid', {
        describe: 'Strip invalid values that do not conform to the JSPF specifications',
        type: 'boolean',
        default: true
      })
      .option('quiet', {
        describe: 'Suppress validation warnings. Only errors will be shown.',
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
