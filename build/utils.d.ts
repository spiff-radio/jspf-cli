export declare function getPathExtension(filePath: string): string | null;
export declare function getPathFilename(filePath: string): string;
/**
 * Check if a string is a JSON string (starts and ends with double quotes)
 * @param str - The string to check
 * @returns true if the string appears to be a JSON string
 */
export declare function isJsonString(str: string): boolean;
/**
 * Remove the values that failed validation from a deep clone of `data`, based on a
 * Zod error's issues, and return the cleaned copy. `data` itself is left untouched.
 *
 * `unrecognized_keys` issues (from .strict() schemas) carry the offending keys on
 * `issue.keys` with `issue.path` pointing at the parent object itself, rather than
 * at each key individually - that case is handled separately from the rest.
 */
export declare function stripInvalidPaths<T>(data: T, issues: {
    code: string;
    path: PropertyKey[];
    keys?: string[];
}[]): T;
