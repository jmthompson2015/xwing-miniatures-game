/*
 * Provides utility methods for arrays.
 *
 * @see http://modernweb.com/2013/12/23/45-useful-javascript-tips-tricks-and-best-practices/
 */
const ArrayUtilities = {};

// Note: This function modifies array.
// array now contains array2 also.
// @see http://stackoverflow.com/questions/351409/appending-to-array
ArrayUtilities.addAll = function(array, array2)
{
   Array.prototype.push.apply(array, array2);
};

ArrayUtilities.intersect = function(array, array2)
{
   // Assumptions:
   // - input is not necessarily sorted
   // - an element only appears once in array and/or array2
   const answer = [];

   for (let i = 0; i < array.length; i++)
   {
      const n = array[i];

      if (array2.indexOf(n) >= 0)
      {
         answer.push(n);
      }
   }

   return answer;
};

ArrayUtilities.randomElement = function(array)
{
   const index = Math.floor(Math.random() * array.length);

   return array[index];
};

// Note: This function modifies array.
ArrayUtilities.remove = function(array, element)
{
   const index = array.indexOf(element);

   if (index >= 0)
   {
      array.splice(index, 1);
   }
};

// Note: This function modifies array.
ArrayUtilities.shuffle = function(array)
{
   array.sort(function()
   {
      return Math.random() - 0.5;
   });
};

export default ArrayUtilities;