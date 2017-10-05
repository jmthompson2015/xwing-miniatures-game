"use strict";

define(function()
{
   var StringAugments = {};

   if (!String.pad)
   {
      /*
       * @param n Number. (required)
       * @param width Desired padded width. (required)
       * @param z Pad character. (optional; default '0')
       */
      String.pad = function(n, width, z)
      {
         z = z || '0';
         n = n + '';
         return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      };
   }

   return StringAugments;
});
