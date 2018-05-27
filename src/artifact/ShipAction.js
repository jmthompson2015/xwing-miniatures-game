"use strict";

define(function()
{
   var ShipAction = {
      BARREL_ROLL: "barrelRoll",
      BOOST: "boost",
      CLOAK: "cloak",
      COORDINATE: "coordinate",
      DECLOAK: "decloak",
      EVADE: "evade",
      FOCUS: "focus",
      JAM: "jam",
      RECOVER: "recover",
      REINFORCE: "reinforce",
      RELOAD: "reload",
      ROTATE_ARC: "rotateArc",
      SLAM: "slam",
      TARGET_LOCK: "targetLock",

      properties:
      {
         "barrelRoll":
         {
            name: "Barrel Roll",
            isImplemented: true,
            key: "barrelRoll",
         },
         "boost":
         {
            name: "Boost",
            isImplemented: true,
            key: "boost",
         },
         "cloak":
         {
            name: "Cloak",
            isImplemented: true,
            key: "cloak",
         },
         "coordinate":
         {
            name: "Coordinate",
            isImplemented: true,
            key: "coordinate",
         },
         "decloak":
         {
            name: "Decloak",
            isImplemented: true,
            key: "decloak",
         },
         "evade":
         {
            name: "Evade",
            isImplemented: true,
            key: "evade",
         },
         "focus":
         {
            name: "Focus",
            isImplemented: true,
            key: "focus",
         },
         "jam":
         {
            name: "Jam",
            isImplemented: true,
            key: "jam",
         },
         "recover":
         {
            name: "Recover",
            isImplemented: true,
            key: "recover",
         },
         "reinforce":
         {
            name: "Reinforce",
            isImplemented: true,
            key: "reinforce",
         },
         "reload":
         {
            name: "Reload",
            key: "reload",
         },
         "rotateArc":
         {
            name: "Rotate Arc",
            key: "rotateArc",
         },
         "slam":
         {
            name: "SLAM",
            isImplemented: true,
            key: "slam",
         },
         "targetLock":
         {
            name: "Target Lock",
            isImplemented: true,
            key: "targetLock",
         },
      },
   };

   ShipAction.keys = function()
   {
      return Object.keys(ShipAction.properties);
   };

   ShipAction.values = function()
   {
      return Object.values(ShipAction.properties);
   };

   ShipAction.keys().forEach(function(shipActionKey)
   {
      var shipAction = ShipAction.properties[shipActionKey];
      shipAction.xwingType = ShipAction;

      shipAction.oncePerRound = true;
   });

   //////////////////////////////////////////////////////////////////////////
   // Utility methods.

   ShipAction.findByName = function(name)
   {
      var answer;
      var values = ShipAction.values();

      for (var i = 0; i < values.length; i++)
      {
         if (values[i].name === name)
         {
            answer = values[i];
            break;
         }
      }

      return answer;
   };

   ShipAction.toString = function()
   {
      return "ShipAction";
   };

   if (Object.freeze)
   {
      Object.freeze(ShipAction);
   }

   return ShipAction;
});
