"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathExtension = getPathExtension;
exports.getPathFilename = getPathFilename;
exports.isJsonString = isJsonString;
exports.stripInvalidPaths = stripInvalidPaths;
//get extension out of a file path
function getPathExtension(filePath) {
    const match = /[^/.]\.([^/.]+)$/.exec(filePath);
    if (match) {
        return match[1].toLowerCase();
    }
    return null;
}
//get filename out of a file path
function getPathFilename(filePath) {
    const match = filePath.match(/[/\\]([^/\\]+)$/); //both unix & windows
    if (match) {
        return match[1];
    }
    return filePath;
}
/**
 * Check if a string is a JSON string (starts and ends with double quotes)
 * @param str - The string to check
 * @returns true if the string appears to be a JSON string
 */
function isJsonString(str) {
    str = str.trim();
    return str.length >= 2 && str[0] === '"' && str[str.length - 1] === '"';
}
/**
 * Remove the values that failed validation from a deep clone of `data`, based on a
 * Zod error's issues, and return the cleaned copy. `data` itself is left untouched.
 *
 * `unrecognized_keys` issues (from .strict() schemas) carry the offending keys on
 * `issue.keys` with `issue.path` pointing at the parent object itself, rather than
 * at each key individually - that case is handled separately from the rest.
 */
function stripInvalidPaths(data, issues) {
    const cleaned = structuredClone(data);
    for (const issue of issues) {
        const isUnrecognizedKeys = issue.code === 'unrecognized_keys';
        const parentPath = isUnrecognizedKeys ? issue.path : issue.path.slice(0, -1);
        const keysToRemove = isUnrecognizedKeys ? (issue.keys ?? []) : [issue.path[issue.path.length - 1]];
        let parent = cleaned;
        for (const segment of parentPath) {
            if (parent == null)
                break;
            parent = parent[segment];
        }
        if (parent == null)
            continue;
        for (const key of keysToRemove) {
            if (Array.isArray(parent) && typeof key === 'number') {
                // Nulled out rather than spliced, so sibling indices referenced by other
                // issues stay stable; the resulting hole is compacted by cleanDeep later.
                parent[key] = undefined;
            }
            else {
                delete parent[key];
            }
        }
    }
    return cleaned;
}
