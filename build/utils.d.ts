import { Schema } from 'jsonschema';
export declare function cleanNestedObject(obj: Record<string, any>): Record<string, any>;
export declare function getPathExtension(filePath: string): string | null;
export declare function getPathFilename(filePath: string): string;
export declare function getChildSchema(path: string, inputSchema?: Schema): Schema;
