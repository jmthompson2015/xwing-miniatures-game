/*
 * Provides an enumeration of factions for Starfighter Squadrons.
 *
 * @see <a href="http://stijndewitt.wordpress.com/2014/01/26/enums-in-javascript/">Enums in JavaScript</a>
 */
"use strict";

define(function()
{
   var Faction = {
      IMPERIAL: "imperial",
      FIRST_ORDER: "firstOrder",
      REBEL: "rebel",
      RESISTANCE: "resistance",
      SCUM: "scum",

      properties:
      {
         "imperial":
         {
            name: "Imperial",
            shortName: "Imperial",
            description: "Imperial faction",
            color: "rgb(0, 255, 0)",
            key: "imperial",
         },
         "firstOrder":
         {
            name: "First Order",
            shortName: "FirstOrder",
            description: "First Order faction",
            color: "rgb(0, 255, 0)",
            key: "firstOrder",
         },
         "rebel":
         {
            name: "Rebel",
            shortName: "Rebel",
            description: "Rebel faction",
            color: "red",
            key: "rebel",
         },
         "resistance":
         {
            name: "Resistance",
            shortName: "Resistance",
            description: "Resistance faction",
            color: "red",
            key: "resistance",
         },
         "scum":
         {
            name: "Scum & Villainy",
            shortName: "Scum",
            description: "Scum & Villainy faction",
            color: "rgb(255, 215, 0)",
            key: "scum",
         },
      },
   };

   Faction.friend = function(factionKey)
   {
      var answer;

      switch (factionKey)
      {
         case Faction.IMPERIAL:
            answer = Faction.FIRST_ORDER;
            break;
         case Faction.FIRST_ORDER:
            answer = Faction.IMPERIAL;
            break;
         case Faction.REBEL:
            answer = Faction.RESISTANCE;
            break;
         case Faction.RESISTANCE:
            answer = Faction.REBEL;
            break;
      }

      return answer;
   };

   Faction.isFriendly = function(factionKey0, factionKey1)
   {

      return (factionKey0 === factionKey1) || (factionKey0 === this.friend(factionKey1));
   };

   Faction.keys = function()
   {
      return Object.keys(Faction.properties);
   };

   Faction.toString = function()
   {
      return "Faction";
   };

   Faction.values = function()
   {
      return Object.values(Faction.properties);
   };

   if (Object.freeze)
   {
      Object.freeze(Faction);
   }

   return Faction;
});
