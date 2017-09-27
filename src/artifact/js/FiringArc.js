"use strict";

define(function()
{
   var FiringArc = {
      FORWARD: "forward",
      AFT: "aft",
      FULL_AFT: "fullAft",

      properties:
      {
         "forward":
         {
            name: "Forward",
            isInFiringArc: function(bearing)
            {
               return (315 <= bearing) || (bearing <= 45);
            },
            key: "forward",
         },
         "aft":
         {
            name: "Aft",
            isInFiringArc: function(bearing)
            {
               return (135 <= bearing) && (bearing <= 225);
            },
            key: "aft",
         },
         "fullAft":
         {
            name: "Full Aft",
            isInFiringArc: function(bearing)
            {
               return (90 <= bearing) && (bearing <= 270);
            },
            key: "fullAft",
         },
      },
   };

   FiringArc.keys = function()
   {
      return Object.keys(FiringArc.properties);
   };

   FiringArc.toString = function()
   {
      return "FiringArc";
   };

   FiringArc.values = function()
   {
      return Object.values(FiringArc.properties);
   };

   if (Object.freeze)
   {
      Object.freeze(FiringArc);
   }

   return FiringArc;
});
