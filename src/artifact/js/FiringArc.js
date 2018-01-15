"use strict";

define(function()
{
   var FiringArc = {
      AFT: "aft",
      AFT_180: "aft180",
      BULLSEYE: "bullseye",
      FORWARD: "forward",
      FORWARD_180: "forward180",
      PORT: "port",
      STARBOARD: "starboard",

      properties:
      {
         "aft":
         {
            name: "Aft",
            key: "aft",
         },
         "aft180":
         {
            name: "Aft 180",
            key: "aft180",
         },
         "bullseye":
         {
            name: "Bullseye",
            key: "bullseye",
         },
         "forward":
         {
            name: "Forward",
            key: "forward",
         },
         "forward180":
         {
            name: "Forward 180",
            key: "forward180",
         },
         "port":
         {
            name: "Port",
            key: "port",
         },
         "starboard":
         {
            name: "Starboard",
            key: "starboard",
         },
      },
   };

   FiringArc.keys = function()
   {
      return Object.keys(FiringArc.properties);
   };

   FiringArc.values = function()
   {
      return Object.values(FiringArc.properties);
   };

   FiringArc.toString = function()
   {
      return "FiringArc";
   };

   if (Object.freeze)
   {
      Object.freeze(FiringArc);
   }

   return FiringArc;
});
