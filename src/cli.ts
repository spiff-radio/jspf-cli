#!/usr/bin/env node
const clear = require('clear');
const figlet = require('figlet');

import 'reflect-metadata';
import { plainToClass,classToPlain,serialize } from 'class-transformer';
import { validateSync } from 'class-validator';
import {Playlist,Track} from "./types";

const jspf = {
   playlist : {
     title         : "JSPF example",
     creator       : "Name of playlist author",
     annotation    : "Super playlist",
     info          : "http://example.com/",
     location      : "http://example.com/",
     identifier    : "http://example.com/",
     image         : "http://example.com/",
     date          : "2005-01-08T17:10:47-05:00",
     license       : "http://example.com/",
     attribution   : [
       {identifier   : "http://example.com/"},
       {location     : "http://example.com/"}
     ],
     link          : [
       {"http://example.com/rel/1/" : "http://example.com/body/1/"},
       {"http://example.com/rel/2/" : "http://example.com/body/2/"}
     ],
     meta          : [
       {"http://example.com/rel/1/" : "my meta 14"},
       {"http://example.com/rel/2/" : "345"}
     ],
     extension     : {
       "http://example.com/app/1/" : ['ARBITRARY_EXTENSION_BODY', 'ARBITRARY_EXTENSION_BODY'],
       "http://example.com/app/2/" : ['ARBITRARY_EXTENSION_BODY']
     },
     track         : [
       {
         location      : ["http://example.com/1.ogg", "http://example.com/2.mp3"],
         identifier    : ["http://example.com/1/", "http://example.com/2/"],
         title         : "Track title",
         creator       : "Artist name",
         annotation    : "Some text",
         info          : "http://example.com/",
         image         : "http://example.com/",
         album         : "Album name",
         trackNum      : 1,
         duration      : 0,
         link          : [
           {"http://example.com/rel/1/" : "http://example.com/body/1/"},
           {"http://example.com/rel/2/" : "http://example.com/body/2/"}
         ],
         meta          : [
           {"http://example.com/rel/1/" : "my meta 14"},
           {"http://example.com/rel/2/" : "345"}
         ],
         extension     : {
           "http://example.com/app/1/" : ['ARBITRARY_EXTENSION_BODY', 'ARBITRARY_EXTENSION_BODY'],
           "http://example.com/app/2/" : ['ARBITRARY_EXTENSION_BODY']
         }
       }
     ]
   }
 }

clear();
console.log(
  figlet.textSync('JSPF', { horizontalLayout: 'full' })
);
//const playlist = new JSPFPlaylist(jspf.playlist);


const playlist = plainToClass(Playlist,jspf.playlist);
const playlistErrors = validateSync(playlist);

/*
if (playlistErrors.length > 0) {
  console.log('PLAYLIST VALIDATION ERROR:', playlistErrors);
}else{
  console.log("CLASS PLAYLIST",playlist);
}
*/

const track = plainToClass(Track,jspf.playlist.track[0]);
const trackErrors = validateSync(track);

if (trackErrors.length > 0) {
  console.log('TRACK VALIDATION ERROR:', trackErrors);

  // Find the validation error for the 'link' property
  const linkError = trackErrors.find(error => error.property === 'link');

  // Access the error message(s) for the 'link' property
  if (linkError) {
    console.log("LINK ERROR",linkError?.children);

    if (linkError?.children){
      console.log("LINK ERROR",linkError?.children[0]);
    }

    const values =  linkError?.constraints ? Object.values(linkError?.constraints) : [];
    const errorMessages = Object.values(values);
    console.log(errorMessages);
  }


}else{
  console.log("CLASS TRACK",track);
}

/*
const track = plainToClass(Track,jspf.playlist.track[0]);
console.log("TOTO",track);
const errors = validateSync(track);
if (errors.length > 0) {
  console.log('Validation errors:', errors);
} else {
  console.log('Track:', track);
}
*/

console.log("END");
