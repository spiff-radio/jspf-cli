//http://objectmodel.js.org/#doc-set-models
//TOUFIX use Sets instead of array when possible

import { BasicModel,ArrayModel,ObjectModel,Model } from "objectmodel"

function isTrimmedString(str){
  return str.trim() === str;
}

function isUriString(str){
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}


function isPositiveNumber(n){
	return n >= 0
}

//checks that the object has maximum one property
function isSinglePropObject(obj){
	return Object.keys(obj).length <= 1;
}

//check all keys of this object are URIs
function isUriKeysObject(obj){
	return Object.keys(obj).every(k => isUriString(k));
}

//check all values of this object are URIs
function isUriValuesObject(obj){
	return Object.values(obj).every(v => isUriString(v));
}

//check all values of this object are arrays
function isArrayValuesObject(obj){
	return Object.values(obj).every(v => Array.isArray(v));
}

function parseDateString(value){
  // parse the string into a date object
  const date = new Date(value);

  // if the parsing failed or the resulting date is invalid, throw an error
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${value}`);
  }

  // return the date object
  return date;
}

export const TrimmedString = BasicModel(String).assert(isTrimmedString).as("TrimmedString");
export const UriString = TrimmedString.extend().assert(isUriString);
export const PositiveNumber = BasicModel(Number).assert(isPositiveNumber);

export const AttributionObject = ObjectModel({})
.assert(isSinglePropObject,"should have maximum one property")
.assert(isUriValuesObject,"value should be an URI string")

export const LinkObject = ObjectModel({})
.assert(isSinglePropObject,"should have maximum one property")
.assert(isUriKeysObject,"key should be an URI string")
.assert(isUriValuesObject,"value should be an URI string")

export const MetaObject = ObjectModel({})
.assert(isSinglePropObject,"should have maximum one property")
.assert(isUriKeysObject,"key should be an URI string")

export const ExtensionObject = ObjectModel({})
.assert(isUriKeysObject,"every key should be an URI string")
.assert(isArrayValuesObject,"every value should be an array")

export const AttributionCollection = ArrayModel(AttributionObject);
export const LinkCollection = ArrayModel(LinkObject);
export const MetaCollection = ArrayModel(MetaObject);
export const ExtensionCollection = ObjectModel(ExtensionObject);
export const UriCollection = ArrayModel(UriString);

function parseDateString(value){
  // parse the string into a date object
  const date = new Date(value);

  // if the parsing failed or the resulting date is invalid, throw an error
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${value}`);
  }

  // return the date object
  return date;
}

export const DateStringModel = BasicModel(String).assert(parseDateString);


export const Track = new ObjectModel({
	location: [UriCollection],
	identifier: [UriCollection],
	title: [TrimmedString],
	creator: [TrimmedString],
	annotation: [TrimmedString],
	info: [UriString],
	image: [UriString],
	album: [TrimmedString],
	trackNum: [PositiveNumber],
	duration: [PositiveNumber],
	link: [LinkCollection],
	meta: [MetaCollection],
	extension: [ExtensionCollection]
});

export const TrackCollection = ArrayModel(Track);

export const Playlist = new ObjectModel({
	title: [TrimmedString],
	creator: [TrimmedString],
	annotation: [TrimmedString],
	info: [UriString],
	location: [UriString],
	identifier: [UriString],
	image: [UriString],
	date: [DateStringModel],
	license: [UriString],
	attribution: [AttributionCollection],
	link: [LinkCollection],
	meta: [MetaCollection],
	extension: [ExtensionCollection],
	track: [TrackCollection]
});