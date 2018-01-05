"use strict";

define(function()
{
   var XWingType = {
      CONDITIONS: "conditions",
      DAMAGES: "damages",
      DAMAGES_TFA: "damagesTfa",
      PILOTS: "pilots",
      SHIPS: "ships",
      SOURCES: "sources",
      UPGRADES: "upgrades",

      properties:
      {
         "conditions":
         {
            name: "Conditions",
            filepath: "../../../lib/xwing-data/data/conditions.js",
            key: "conditions",
         },
         "damages":
         {
            name: "Damages",
            filepath: "../../../lib/xwing-data/data/damage-deck-core.js",
            key: "damages",
         },
         "damagesTfa":
         {
            name: "Damages TFA",
            filepath: "../../../lib/xwing-data/data/damage-deck-core-tfa.js",
            key: "damagesTfa",
         },
         "pilots":
         {
            name: "Pilots",
            filepath: "../../../lib/xwing-data/data/pilots.js",
            key: "pilots",
         },
         "ships":
         {
            name: "Ships",
            filepath: "../../../lib/xwing-data/data/ships.js",
            key: "ships",
         },
         "sources":
         {
            name: "Sources",
            filepath: "../../../lib/xwing-data/data/sources.js",
            key: "sources",
         },
         "upgrades":
         {
            name: "Upgrades",
            filepath: "../../../lib/xwing-data/data/upgrades.js",
            key: "upgrades",
         },
      },
   };

   XWingType.keys = function()
   {
      return Object.keys(XWingType.properties);
   };

   XWingType.values = function()
   {
      return Object.values(XWingType.properties);
   };

   if (Object.freeze)
   {
      Object.freeze(XWingType);
   }

   return XWingType;
});
