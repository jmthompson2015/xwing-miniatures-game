"use strict";

define(function()
{
   var ShipState = {
      PILOT_SKILL: "pilotSkill",
      PRIMARY_WEAPON: "primaryWeapon",
      TURRET_WEAPON: "turretWeapon",
      ENERGY: "energy",
      AGILITY: "agility",
      HULL: "hull",
      SHIELD: "shield",

      properties:
      {
         "pilotSkill":
         {
            name: "Pilot Skill",
            numberClass: "orange",
            key: "pilotSkill",
         },
         "primaryWeapon":
         {
            name: "Primary Weapon",
            numberClass: "red",
            key: "primaryWeapon",
         },
         "turretWeapon":
         {
            name: "Turret Weapon",
            numberClass: "red",
            key: "turretWeapon",
         },
         "energy":
         {
            name: "Energy",
            numberClass: "xw-violet",
            key: "energy",
         },
         "agility":
         {
            name: "Agility",
            numberClass: "xw-green",
            key: "agility",
         },
         "hull":
         {
            name: "Hull",
            numberClass: "yellow",
            key: "hull",
         },
         "shield":
         {
            name: "Shield",
            numberClass: "xw-cyan",
            key: "shield",
         },
      },
   };

   ShipState.keys = function()
   {
      return Object.keys(ShipState.properties);
   };

   ShipState.toString = function()
   {
      return "ShipState";
   };

   ShipState.values = function()
   {
      return Object.values(ShipState.properties);
   };

   if (Object.freeze)
   {
      Object.freeze(ShipState);
   }

   return ShipState;
});
