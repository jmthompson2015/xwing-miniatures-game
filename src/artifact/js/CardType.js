"use strict";

define(function()
{
   var CardType = {
      CONDITION: "condition",
      DAMAGE: "damage",
      PILOT: "pilot",
      UPGRADE: "upgrade",

      properties:
      {
         "condition":
         {
            name: "Condition",
            key: "condition",
         },
         "damage":
         {
            name: "Damage",
            key: "damage",
         },
         "pilot":
         {
            name: "Pilot",
            key: "pilot",
         },
         "upgrade":
         {
            name: "Upgrade",
            key: "upgrade",
         },
      },
   };

   CardType.keys = function()
   {
      return Object.keys(CardType.properties);
   };

   CardType.values = function()
   {
      return Object.values(CardType.properties);
   };

   if (Object.freeze)
   {
      Object.freeze(CardType);
   }

   return CardType;
});
