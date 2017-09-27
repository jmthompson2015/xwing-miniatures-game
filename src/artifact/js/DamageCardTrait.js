"use strict";

define(function()
{
   var DamageCardTrait = {
      PILOT: "pilot",
      SHIP: "ship",
      properties:
      {
         "pilot":
         {
            name: "PilotCard",
            key: "pilot",
         },
         "ship":
         {
            name: "Ship",
            key: "ship",
         },
      },
   };

   DamageCardTrait.keys = function()
   {
      return Object.keys(DamageCardTrait.properties);
   };

   DamageCardTrait.toString = function()
   {
      return "DamageCardTrait";
   };

   DamageCardTrait.values = function()
   {
      return Object.values(DamageCardTrait.properties);
   };

   if (Object.freeze)
   {
      Object.freeze(DamageCardTrait);
   }

   return DamageCardTrait;
});
