
//Recursively removes all empty and undefined properties from a JSON object.
export function cleanNestedObject(obj: Record<string, any>): Record<string, any> {
  obj = {...obj};//clone it
  Object.keys(obj).forEach(function(key) {
      // Get this value and its type
      var value = obj[key];
      var type = typeof value;
      if (type === "object" && value !== null && !Array.isArray(value)) {
          cleanNestedObject(value);
          if (value === undefined || value === ''){
            delete obj[key];
          }
          if (!Object.keys(value).length) {
              delete obj[key]
          }
      }
      else if (type === "undefined" || value === null || value === '') {
          // Undefined, null, or empty string, remove it
          delete obj[key];
      }
  });
  return obj;
}

//get extension out of a file path
export function getPathExtension(filePath: string): string | null {
  const match = /[^/.]\.([^/.]+)$/.exec(filePath);
  if (match) {
    return match[1].toLowerCase();
  }
  return null;
}

//get filename out of a file path
export function getPathFilename(filePath: string): string {
  const match = filePath.match(/[/\\]([^/\\]+)$/);//both unix & windows
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
export function isJsonString(str: string): boolean {
  str = str.trim();
  return str.length >= 2 && str[0] === '"' && str[str.length - 1] === '"';
}

