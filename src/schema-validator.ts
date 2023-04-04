import {Validator, ValidatorResult, ValidationError, Schema as JSONSchema} from 'jsonschema';
import jsonSchema from './jsonschema/schema.json';

export default class JSPFSchemaValidator{
  data:object;
  schema:object;
  validator;
  validation;
  constructor(jspf:object){
    this.data = jspf;
    this.schema = jsonSchema;
    this.validator = new Validator();
    this.validation = this.validator.validate(this.data,this.schema);
  }

  getValidData(){
    return this.removeInvalidValues();
  }

  get errors():ValidationError[]{
    return this.validation.errors;
  }

  private removeInvalidValues():object {
    const data = JSON.parse(JSON.stringify(this.data));//make copy
    this.errors.forEach(error => this.removeValueForError(data,error));
    return data;
  }

  private removeValueForError(data: object, error: ValidationError): object {
    const errorPath = error.property.replace(/\[(\w+)\]/g, '.$1').split('.');
    let currentNode: { [key: string]: any } = data;

    for (let i = 0; i < errorPath.length; i++) {
      const key = errorPath[i];
      if (i === errorPath.length - 1) {
        if (Array.isArray(currentNode)) {
          if (key !== null) {
            currentNode.splice(parseInt(key, 10), 1);
          }
        } else if (typeof currentNode === 'object') {
          delete currentNode[key];
        }
      } else {
        if (!currentNode.hasOwnProperty(key)) {
          // Property is not defined in the data, maybe already deleted, move on to next error
          continue;
        }
        currentNode = currentNode[key];
      }
    }
    return data;
  }

}
