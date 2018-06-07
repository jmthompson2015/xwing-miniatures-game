import InputValidator from "./InputValidator.js";

const ObjectUtilities = {};

ObjectUtilities.merge = function(a, b)
{
   InputValidator.validateNotNull("a", a);
   InputValidator.validateNotNull("b", b);

   const keys = Object.keys(b);

   keys.forEach(function(key)
   {
      a[key] = b[key];
   });
};

export default ObjectUtilities;