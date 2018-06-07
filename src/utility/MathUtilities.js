/*
 * Provides utility methods for Math.
 */
const MathUtilities = {};

/*
 * @param number The number to format.
 * @param digits The number of digits to appear after the decimal point. (optional)
 */
MathUtilities.format = function(number, digits)
{
   let answer = number;

   if (number !== undefined && typeof number === "number" && !isNaN(number))
   {
      answer = number.toFixed(digits);
   }

   return answer;
};

/*
 * @param number The number to round.
 * @param digits The number of digits to appear after the decimal point.
 */
MathUtilities.round = function(number, digits)
{
   const factor = Math.pow(10.0, digits);

   return Math.round(factor * number) / factor;
};

export default MathUtilities;