"use strict";

define(["utility/FileLoader", "utility/InputValidator"],
   function(FileLoader, InputValidator)
   {
      var JSONFileLoader = {};

      JSONFileLoader.loadFile = function(filepath, callback)
      {
         InputValidator.validateIsString("filepath", filepath);
         InputValidator.validateIsFunction("callback", callback);

         var finishCallback = function(response)
         {
            finishConvert(response, callback);
         };

         FileLoader.loadFile(filepath, finishCallback);
      };

      function finishConvert(response, callback)
      {
         var content = JSON.parse(response);

         callback(content);
      }

      return JSONFileLoader;
   });
