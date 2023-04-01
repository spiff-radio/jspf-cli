#!/usr/bin/env node
const clear = require('clear');
const figlet = require('figlet');

import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import {JSPFPlaylist} from "./types";

const jspf = {
   playlist : {
     title         : "JSPF example"
     ,
     creator       : "Name of playlist author",
     annotation    : "Super playlist",
     info          : "http://example.com/",
     location      : "http://example.com/",
     identifier    : "http://example.com/",
     image         : "http://example.com/",
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

const playlist = plainToClass(JSPFPlaylist, jspf.playlist, { excludeExtraneousValues: true })


console.log(playlist);
console.log(playlist.track[0].hello());

console.log("END");
