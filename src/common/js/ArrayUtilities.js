/*
 * Provides utility methods for arrays.
 *
 * @see http://modernweb.com/2013/12/23/45-useful-javascript-tips-tricks-and-best-practices/
 */
"use strict";

define(function()
{
   var ArrayUtilities = {};

   // Note: This function modifies array.
   // array now contains array2 also.
   // @see http://stackoverflow.com/questions/351409/appending-to-array
   ArrayUtilities.xwingAddAll = function(array, array2)
   {
      Array.prototype.push.apply(array, array2);
   };

   ArrayUtilities.xwingIntersect = function(array, array2)
   {
      // Assumptions:
      // - input is not necessarily sorted
      // - an element only appears once in array and/or array2
      var answer = [];

      for (var i = 0; i < array.length; i++)
      {
         var n = array[i];

         if (array2.indexOf(n) >= 0)
         {
            answer.push(n);
         }
      }

      return answer;
   };

   ArrayUtilities.xwingRandomElement = function(array)
   {
      var index = Math.floor(Math.random() * array.length);

      return array[index];
   };

   // Note: This function modifies array.
   ArrayUtilities.xwingRemove = function(array, element)
   {
      var index = array.indexOf(element);

      if (index >= 0)
      {
         array.splice(index, 1);
      }
   };

   // Note: This function modifies array.
   ArrayUtilities.xwingShuffle = function(array)
   {
      array.sort(function()
      {
         return Math.random() - 0.5;
      });
   };

   return ArrayUtilities;
});
