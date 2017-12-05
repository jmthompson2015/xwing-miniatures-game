"use strict";

define(function()
{
   var UpgradeType = {
      ASTROMECH: "astromech",
      BOMB: "bomb",
      CANNON: "cannon",
      CARGO: "cargo",
      CREW: "crew",
      ELITE: "elite",
      HARDPOINT: "hardpoint",
      ILLICIT: "illicit",
      MISSILE: "missile",
      MODIFICATION: "modification",
      SALVAGED_ASTROMECH: "salvagedAstromech",
      SYSTEM: "system",
      TEAM: "team",
      TECH: "tech",
      TITLE: "title",
      TORPEDO: "torpedo",
      TURRET: "turret",
      properties:
      {
         "astromech":
         {
            name: "Astromech",
            key: "astromech",
         },
         "bomb":
         {
            name: "Bomb",
            key: "bomb",
         },
         "cannon":
         {
            name: "Cannon",
            key: "cannon",
         },
         "cargo":
         {
            name: "Cargo",
            key: "cargo",
         },
         "crew":
         {
            name: "Crew",
            key: "crew",
         },
         "elite":
         {
            name: "Elite",
            key: "elite",
         },
         "hardpoint":
         {
            name: "Hardpoint",
            key: "hardpoint",
         },
         "illicit":
         {
            name: "Illicit",
            key: "illicit",
         },
         "missile":
         {
            name: "Missile",
            key: "missile",
         },
         "modification":
         {
            name: "Modification",
            key: "modification",
         },
         "salvagedAstromech":
         {
            name: "Salvaged Astromech",
            key: "salvagedAstromech",
         },
         "system":
         {
            name: "System",
            key: "system",
         },
         "team":
         {
            name: "Team",
            key: "team",
         },
         "tech":
         {
            name: "Tech",
            key: "tech",
         },
         "title":
         {
            name: "Title",
            key: "title",
         },
         "torpedo":
         {
            name: "Torpedo",
            key: "torpedo",
         },
         "turret":
         {
            name: "Turret",
            key: "turret",
         },
      },
   };

   UpgradeType.keys = function()
   {
      return Object.keys(UpgradeType.properties);
   };

   UpgradeType.values = function()
   {
      return Object.values(UpgradeType.properties);
   };

   UpgradeType.keys().forEach(function(upgradeTypeKey)
   {
      var upgradeType = UpgradeType.properties[upgradeTypeKey];

      var imagePath = upgradeType.name + "/";
      upgradeType.imagePath = imagePath;
   });

   //////////////////////////////////////////////////////////////////////////
   // Utility methods.

   UpgradeType.toString = function()
   {
      return "UpgradeType";
   };

   if (Object.freeze)
   {
      Object.freeze(UpgradeType);
   }

   return UpgradeType;
});
