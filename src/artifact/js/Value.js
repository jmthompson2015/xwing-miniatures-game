"use strict";

define(function()
{
   var Value = {
      AGILITY: "agility",
      ENERGY: "energy",
      HULL: "hull",
      PILOT_SKILL: "pilotSkill",
      PRIMARY_WEAPON: "primaryWeapon",
      SHIELD: "shield",

      properties:
      {
         "agility":
         {
            name: "Agility",
            key: "agility",
         },
         "energy":
         {
            name: "Energy",
            key: "energy",
         },
         "hull":
         {
            name: "Hull",
            key: "hull",
         },
         "pilotSkill":
         {
            name: "PilotCard Skill",
            key: "pilotSkill",
         },
         "primaryWeapon":
         {
            name: "Primary Weapon",
            key: "primaryWeapon",
         },
         "shield":
         {
            name: "Shield",
            key: "shield",
         },
      },
   };

   Value.keys = function()
   {
      return Object.keys(Value.properties);
   };

   Value.toString = function()
   {
      return "Value";
   };

   Value.values = function()
   {
      return Object.values(Value.properties);
   };

   if (Object.freeze)
   {
      Object.freeze(Value);
   }

   return Value;
});
