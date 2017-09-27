/*
 * Provides utility methods for arrays.
 *
 * @see http://modernweb.com/2013/12/23/45-useful-javascript-tips-tricks-and-best-practices/
 */
"use strict";

define(function()
{
   var ArrayAugments = {};

   // Note: This function modifies array.
   // this now contains array2 also.
   // @see http://stackoverflow.com/questions/351409/appending-to-array
   if (!Array.prototype.xwingAddAll)
   {
      Array.prototype.xwingAddAll = function(array2)
      {
         Array.prototype.push.apply(this, array2);
      };
   }

   if (!Array.prototype.xwingIntersect)
   {
      Array.prototype.xwingIntersect = function(array2)
      {
         // Assumptions:
         // - input is not necessarily sorted
         // - an element only appears once in this and/or array2
         var answer = [];

         for (var i = 0; i < this.length; i++)
         {
            var n = this[i];

            if (array2.indexOf(n) >= 0)
            {
               answer.push(n);
            }
         }

         return answer;
      };
   }

   if (!Array.prototype.xwingRandomElement)
   {
      Array.prototype.xwingRandomElement = function()
      {
         var index = Math.floor(Math.random() * this.length);

         return this[index];
      };
   }

   // Note: This function modifies array.
   if (!Array.prototype.xwingRemove)
   {
      Array.prototype.xwingRemove = function(element)
      {
         var index = this.indexOf(element);

         if (index >= 0)
         {
            this.splice(index, 1);
         }
      };
   }

   // Note: This function modifies array.
   if (!Array.prototype.xwingShuffle)
   {
      Array.prototype.xwingShuffle = function()
      {
         this.sort(function()
         {
            return Math.random() - 0.5;
         });
      };
   }

   return ArrayAugments;
});
