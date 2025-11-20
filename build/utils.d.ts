import { Schema } from 'jsonschema';
export declare function cleanNestedObject(obj: Record<string, any>): Record<string, any>;
export declare function getPathExtension(filePath: string): string | null;
export declare function getPathFilename(filePath: string): string;
/**
 * Check if a string is a JSON string (starts and ends with double quotes)
 * @param str - The string to check
 * @returns true if the string appears to be a JSON string
 */
export declare function isJsonString(str: string): boolean;
export declare function getChildSchema(path: string, inputSchema?: Schema): Schema;
