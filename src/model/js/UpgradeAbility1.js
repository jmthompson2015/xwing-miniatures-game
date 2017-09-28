/*
 * Provides upgrade abilities for the Planning Phase.
 */
"use strict";

define(function()
{
   var UpgradeAbility1 = {};

   UpgradeAbility1.toString = function()
   {
      return "model/js/UpgradeAbility1";
   };

   if (Object.freeze)
   {
      Object.freeze(UpgradeAbility1);
   }

   return UpgradeAbility1;
});
