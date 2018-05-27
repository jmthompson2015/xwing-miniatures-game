"use strict";

define(["utility/InputValidator"], function(InputValidator)
{
   var ObjectUtilities = {};

   ObjectUtilities.merge = function(a, b)
   {
      InputValidator.validateNotNull("a", a);
      InputValidator.validateNotNull("b", b);

      var keys = Object.keys(b);

      keys.forEach(function(key)
      {
         a[key] = b[key];
      });
   };

   return ObjectUtilities;
});
