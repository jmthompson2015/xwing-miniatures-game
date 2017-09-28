/*
 * Provides pilot abilities for the Planning Phase.
 */
"use strict";

define(function()
{
   var PilotAbility1 = {};

   PilotAbility1.toString = function()
   {
      return "model/js/PilotAbility1";
   };

   if (Object.freeze)
   {
      Object.freeze(PilotAbility1);
   }

   return PilotAbility1;
});
