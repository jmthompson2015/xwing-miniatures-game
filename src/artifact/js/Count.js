"use strict";

define(function()
{
   var Count = {
      CLOAK: "cloak",
      ENERGY: "energy",
      EVADE: "evade",
      FOCUS: "focus",
      ION: "ion",
      REINFORCE: "reinforce",
      SHIELD: "shield",
      STRESS: "stress",
      TRACTOR_BEAM: "tractorBeam",
      WEAPONS_DISABLED: "weaponsDisabled",

      properties:
      {
         "cloak":
         {
            name: "Cloak",
            image: "token/CloakToken32.png",
            key: "cloak",
         },
         "energy":
         {
            name: "Energy",
            image: "token/EnergyToken32.png",
            key: "energy",
         },
         "evade":
         {
            name: "Evade",
            image: "token/EvadeToken32.png",
            key: "evade",
         },
         "focus":
         {
            name: "Focus",
            image: "token/FocusToken32.png",
            key: "focus",
         },
         "ion":
         {
            name: "Ion",
            image: "token/IonToken32.png",
            key: "ion",
         },
         "reinforce":
         {
            name: "Reinforce",
            image: "token/ReinforceToken32.png",
            key: "reinforce",
         },
         "shield":
         {
            name: "Shield",
            image: "token/ShieldToken32.png",
            key: "shield",
         },
         "stress":
         {
            name: "Stress",
            image: "token/StressToken32.png",
            key: "stress",
         },
         "tractorBeam":
         {
            name: "Tractor Beam",
            image: "token/TractorBeamToken32.png",
            key: "tractorBeam",
         },
         "weaponsDisabled":
         {
            name: "Weapons Disabled",
            image: "token/WeaponsDisabledToken32.png",
            key: "weaponsDisabled",
         },
      },
   };

   Count.keys = function()
   {
      return Object.keys(Count.properties);
   };

   Count.toString = function()
   {
      return "Count";
   };

   Count.values = function()
   {
      return Object.values(Count.properties);
   };

   if (Object.freeze)
   {
      Object.freeze(Count);
   }

   return Count;
});
