#!/usr/bin/env node
const clear = require('clear');
const figlet = require('figlet');
import {JSPFConverter} from "./types";

const jspf = {
   "playlist" : {
     "title"         : "JSPF example",
     "creator"       : "Name of playlist author",
     "annotation"    : "Super playlist",
     "info"          : "http://example.com/",
     "location"      : "http://example.com/",
     "identifier"    : "http://example.com/",
     "image"         : "http://example.com/",
     "date"          : "2005-01-08T17:10:47-05:00",
     "license"       : "http://example.com/",
     "attribution"   : [
       {"identifier"   : "http://example.com/"},
       {"location"     : "http://example.com/"}
     ],
     "link"          : [
       {"http://example.com/rel/1/" : "http://example.com/body/1/"},
       {"http://example.com/rel/2/" : "http://example.com/body/2/"}
     ],
     "meta"          : [
       {"http://example.com/rel/1/" : "my meta 14"},
       {"http://example.com/rel/2/" : "345"}
     ],
     "extension"     : {
       "http://example.com/app/1/" : ['ARBITRARY_EXTENSION_BODY', 'ARBITRARY_EXTENSION_BODY'],
       "http://example.com/app/2/" : ['ARBITRARY_EXTENSION_BODY']
     },
     "track"         : [
       {
         "location"      : ["http://example.com/1.ogg", "http://example.com/2.mp3"],
         "identifier"    : ["http://example.com/1/", "http://example.com/2/"],
         "title"         : "Track title",
         "creator"       : "Artist name",
         "annotation"    : "Some text",
         "info"          : "http://example.com/",
         "image"         : "http://example.com/",
         "album"         : "Album name",
         "trackNum"      : 1,
         "duration"      : 0,
         "link"          : [
           {"http://example.com/rel/1/" : "http://example.com/body/1/"},
           {"http://example.com/rel/2/" : "http://example.com/body/2/"}
         ],
         "meta"          : [
           {"http://example.com/rel/1/" : "my meta 14"},
           {"http://example.com/rel/2/" : "345"}
         ],
         "extension"     : {
           "http://example.com/app/1/" : ['ARBITRARY_EXTENSION_BODY', 'ARBITRARY_EXTENSION_BODY'],
           "http://example.com/app/2/" : ['ARBITRARY_EXTENSION_BODY']
         }
       }
     ]
   }
 }

/*
const JSONTrackObj = JSON.stringify({
  title         : "Track title",
  creator       : "Artist name",
  zob           : "zub",
  trackNum: -12
});

const track = JSPFConverter.trackFromJSON(JSONTrackObj);
*/

clear();
console.log(
  figlet.textSync('JSPF', { horizontalLayout: 'full' })
);

const jspfObject = JSPFConverter.objectFromJSON(JSON.stringify(jspf));
const playlist = jspfObject.playlist;
console.log(playlist);



console.log("END");
