/*
 * Provides utility methods for Math.
 */
"use strict";

define(function()
{
   var MathAugments = {};

   /*
    * @param number The number to round.
    * @param digits The number of digits to appear after the decimal point.
    */
   if (!Math.xwingRound)
   {
      Math.xwingRound = function(number, digits)
      {
         var factor = Math.pow(10.0, digits);

         return Math.round(factor * number) / factor;
      };
   }

   return MathAugments;
});
