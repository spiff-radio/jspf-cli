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

