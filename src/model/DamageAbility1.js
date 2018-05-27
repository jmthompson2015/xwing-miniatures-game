/*
 * Provides damage abilities for the Planning Phase.
 */
"use strict";

define(function()
{
   var DamageAbility1 = {};

   DamageAbility1.toString = function()
   {
      return "model/DamageAbility1";
   };

   if (Object.freeze)
   {
      Object.freeze(DamageAbility1);
   }

   return DamageAbility1;
});
