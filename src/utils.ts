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
