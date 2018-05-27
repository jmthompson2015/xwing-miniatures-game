"use strict";

define(["utility/InputValidator"], function(InputValidator)
{
   var PlayFormat = {
      STANDARD: "standard",
      CINEMATIC: "cinematic",
      EPIC: "epic",
      properties:
      {
         "standard":
         {
            name: "Standard",
            width: 915, // mm
            height: 915, // mm
            key: "standard",
         },
         "cinematic":
         {
            name: "Cinematic",
            width: 1830, // mm
            height: 915, // mm
            key: "cinematic",
         },
         "epic":
         {
            name: "Epic",
            width: 1830, // mm
            height: 915, // mm
            key: "epic",
         },
      },
   };

   PlayFormat.isPathInPlayArea = function(playFormatKey, path)
   {
      InputValidator.validateNotNull("playFormatKey", playFormatKey);
      InputValidator.validateNotNull("path", path);

      var answer = true;
      var points = path.points();

      for (var i = 0; i < points.length; i += 2)
      {
         if (!PlayFormat.isPointInPlayArea(playFormatKey, points[i], points[i + 1]))
         {
            answer = false;
            break;
         }
      }

      return answer;
   };

   PlayFormat.isPointInPlayArea = function(playFormatKey, xIn, yIn)
   {
      InputValidator.validateNotNull("playFormatKey", playFormatKey);
      InputValidator.validateNotNull("xIn", xIn);
      InputValidator.validateNotNull("yIn", yIn);

      var playFormat = PlayFormat.properties[playFormatKey];
      var x = Math.round(xIn);
      var y = Math.round(yIn);

      return ((0 <= x) && (x < playFormat.width)) && ((0 <= y) && (y < playFormat.height));
   };

   PlayFormat.keys = function()
   {
      return Object.keys(PlayFormat.properties);
   };

   PlayFormat.toString = function()
   {
      return "PlayFormat";
   };

   PlayFormat.values = function()
   {
      return Object.values(PlayFormat.properties);
   };

   if (Object.freeze)
   {
      Object.freeze(PlayFormat);
   }

   return PlayFormat;
});
