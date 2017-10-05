"use strict";

define(["common/js/InputValidator"], function(InputValidator)
{
   var ObjectAugments = {};

   if (!Object.xwingMerge)
   {
      Object.xwingMerge = function(a, b)
      {
         InputValidator.validateNotNull("a", a);
         InputValidator.validateNotNull("b", b);

         var keys = Object.keys(b);

         keys.forEach(function(key)
         {
            a[key] = b[key];
         });
      };
   }

   return ObjectAugments;
});
