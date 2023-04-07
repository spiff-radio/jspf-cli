import {Schema} from 'jsonschema';
import jspfSchema from './entities/jspf/jspf-schema.json';
import merge from 'lodash/merge';

//Recursively removes all empty and undefined properties from a JSON object.
export function removeEmptyAndUndefined(obj: Record<string, any>): Record<string, any> {
  if (Array.isArray(obj)) {
    return obj.filter(v => v !== undefined && v !== '' && removeEmptyAndUndefined(v).length !== 0);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj)
      .filter(([_, v]) => v !== undefined && v !== '')
      .reduce((acc, [k, v]) => ({ ...acc, [k]: removeEmptyAndUndefined(v) }), {});
  } else {
    return obj;
  }
}

//get extension out of a file path
export function extractPathExtension(filePath: string): string | null {
  const match = /[^/.]\.([^/.]+)$/.exec(filePath);
  if (match) {
    return match[1].toLowerCase();
  }
  return null;
}

//Given a JSON schema (or using the default one) and a path, return a new schema - including local references.
//TOUFIX TOUCHECK use a package for this ?
export function getChildSchema(path: string, inputSchema?: Schema): Schema {

  interface CustomSchemaBaseI {
    [key: string]: any; // index signature
  }

  // If inputSchema is not provided, use the default schema
  inputSchema = inputSchema ?? jspfSchema;
  const rootSchema:CustomSchemaBaseI = inputSchema;

  // If path is empty, return the full rootSchema
  if (path === '') return rootSchema;

  const getTargetContent = (path: string, rootSchema: Schema): CustomSchemaBaseI => {
    // Split the path by '.' to get the nested keys
    const keys = path.split('/');

    // Traverse the rootSchema to get the child schema
    let outputSchema:CustomSchemaBaseI = {...rootSchema} as CustomSchemaBaseI;
    for (const key of keys) {
      if (!outputSchema[key]) {
        throw new Error(`Path "${path}" does not exist in the schema`);
      }
      outputSchema = outputSchema[key];
    }
    return outputSchema;
  }

  //From an object of paths, return a new filtered schema
  const filterSchema = (paths: string[], fragmentSchema: CustomSchemaBaseI): CustomSchemaBaseI => {
    const schema: CustomSchemaBaseI = {};

    paths.forEach(path => {
      const pathKeys = path.split('/');
      let currentSchema = fragmentSchema;
      let filteredSchema = schema;

      for (let i = 0; i < pathKeys.length; i++) {
        const pathKey = pathKeys[i];

        if (currentSchema.hasOwnProperty(pathKey)) {
          if (i === pathKeys.length - 1) {
            filteredSchema[pathKey] = currentSchema[pathKey];
          } else {
            if (!filteredSchema.hasOwnProperty(pathKey)) {
              filteredSchema[pathKey] = {};
            }
            filteredSchema = filteredSchema[pathKey];
            currentSchema = currentSchema[pathKey];
          }
        } else {
          break;
        }
      }
    });

    return schema;
  };

  //get a list of local references for schema
  const getLocalReferences = (path:string,schema: CustomSchemaBaseI) => {

    const list:string[] = [];

    const searchLocalReferences = (prop: CustomSchemaBaseI) => {

      if (typeof prop === 'object' && prop !== null && !Array.isArray(prop)) {
        for (const [propKey, propValue] of Object.entries(prop)) {
          const propValue = prop[propKey];
          if (propKey === '$ref'){
            const refPath = propValue.replace('#/', '');
            list.push(refPath);
          }else{
            searchLocalReferences(propValue);
          }

        }
      } else if (Array.isArray(prop)) {
        prop.forEach((item) => searchLocalReferences(item));
      }

    };

    searchLocalReferences(schema);

    //get every local reference
    return filterSchema(list,rootSchema);

  };

  let contentSchema:CustomSchemaBaseI = getTargetContent(path,rootSchema);

  const childReferences = getLocalReferences(path,contentSchema);

  //Add schema version from original vile
  const schemaVersion = rootSchema.$schema ?? "https://json-schema.org/draft/2020-12/schema";//TOUFIX should be in constants ?

  let childSchema: CustomSchemaBaseI = {
    $schema: schemaVersion
  };

  childSchema = merge(childSchema,contentSchema,childReferences);

  return childSchema;

}
