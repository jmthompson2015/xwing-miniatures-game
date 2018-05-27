"use strict";

define(function()
{
   var FileLoader = {};

   FileLoader.loadFile = function(file, callback)
   {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function()
      {
         if (xhr.readyState === 4 /* && xhr.status === 200 */ )
         {
            callback(xhr.responseText);
         }
      };
      xhr.open('GET', file, true);
      xhr.send(null);
   };

   return FileLoader;
});
