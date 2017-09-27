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
            name: "PilotCard Skill",
            key: "pilotSkill",
         },
         "primaryWeapon":
         {
            name: "Primary Weapon",
            key: "primaryWeapon",
         },
         "turretWeapon":
         {
            name: "Turret Weapon",
            key: "turretWeapon",
         },
         "energy":
         {
            name: "Energy",
            key: "energy",
         },
         "agility":
         {
            name: "Agility",
            key: "agility",
         },
         "hull":
         {
            name: "Hull",
            key: "hull",
         },
         "shield":
         {
            name: "Shield",
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
